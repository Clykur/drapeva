import { Router, Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { logger } from "../utils/logger.js";

const router = Router();

// 1. Reserve Stock during checkout (internally called or via API)
router.post(
  "/reserve",
  authenticateJWT,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { variantId, quantity, expiresMinutes } = req.body;
    if (!variantId || !quantity) {
      return res.status(400).json({ error: "variantId and quantity are required" });
    }

    const minutes = expiresMinutes || 15;
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    try {
      const result = await prisma.$transaction(async (tx: any) => {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: { product: true },
        });

        if (!variant) throw new Error("Product variant not found");
        if (variant.stock < quantity) {
          throw new Error(`Insufficient stock for ${variant.product.name} (${variant.size})`);
        }

        // Deduct stock
        await tx.productVariant.update({
          where: { id: variantId },
          data: { stock: { decrement: quantity } },
        });

        // Create reservation
        const reservation = await tx.inventoryReservation.create({
          data: {
            variantId,
            quantity,
            expiresAt,
          },
        });

        // Create movement log
        await tx.inventoryMovement.create({
          data: {
            variantId,
            quantity: -quantity,
            type: "RESERVATION",
            notes: `Reserved for checkout. Expires at ${expiresAt.toISOString()}`,
          },
        });

        return reservation;
      });

      res.status(201).json(result);
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
);

// 2. Release Reservation
router.post(
  "/release",
  authenticateJWT,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { reservationId } = req.body;
    if (!reservationId) return res.status(400).json({ error: "reservationId is required" });

    try {
      const result = await prisma.$transaction(async (tx: any) => {
        const resv = await tx.inventoryReservation.findUnique({ where: { id: reservationId } });
        if (!resv) throw new Error("Reservation not found");
        if (resv.isReleased) throw new Error("Reservation already released");

        // Increment stock back
        await tx.productVariant.update({
          where: { id: resv.variantId },
          data: { stock: { increment: resv.quantity } },
        });

        // Mark released
        const updatedResv = await tx.inventoryReservation.update({
          where: { id: reservationId },
          data: { isReleased: true },
        });

        // Movement log
        await tx.inventoryMovement.create({
          data: {
            variantId: resv.variantId,
            quantity: resv.quantity,
            type: "RELEASE",
            notes: `Released reservation ${reservationId}`,
          },
        });

        return updatedResv;
      });

      res.json(result);
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
);

// 3. Get Movement History (Admin Only)
router.get(
  "/movements",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movements = await prisma.inventoryMovement.findMany({
        include: { variant: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      });
      res.json(movements);
    } catch (err) {
      next(err);
    }
  },
);

// 4. Bulk Update Stock (Admin Only)
router.post(
  "/bulk-update",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, _next: NextFunction) => {
    const { updates } = req.body; // Array of { variantId, quantity }
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "updates array is required" });
    }

    try {
      await prisma.$transaction(async (tx: any) => {
        for (const update of updates) {
          const { variantId, quantity } = update;
          const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
          if (!variant) throw new Error(`Variant ${variantId} not found`);

          const difference = quantity - variant.stock;

          await tx.productVariant.update({
            where: { id: variantId },
            data: { stock: quantity },
          });

          await tx.inventoryMovement.create({
            data: {
              variantId,
              quantity: difference,
              type: "BULK_UPDATE",
              notes: `Bulk stock update from ${variant.stock} to ${quantity}`,
            },
          });
        }
      });

      res.json({ success: true, message: "Bulk inventory updated successfully" });
    } catch (err: unknown) {
      res.status(400).json({ error: err instanceof Error ? err.message : String(err) });
    }
  },
);

// 5. Bulk Export Inventory (Admin Only)
router.get(
  "/export",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventory = await prisma.productVariant.findMany({
        include: { product: true },
      });
      res.json(inventory);
    } catch (err) {
      next(err);
    }
  },
);

// Helper to release expired reservations automatically
export async function releaseExpiredReservations() {
  const now = new Date();
  try {
    const expiredReservations = await prisma.inventoryReservation.findMany({
      where: {
        expiresAt: { lt: now },
        isReleased: false,
      },
    });

    if (expiredReservations.length === 0) return;

    logger.info(`[Inventory] Releasing ${expiredReservations.length} expired reservations`);

    for (const resv of expiredReservations) {
      try {
        await prisma.$transaction(async (tx: any) => {
          // Increment stock back
          await tx.productVariant.update({
            where: { id: resv.variantId },
            data: { stock: { increment: resv.quantity } },
          });

          // Mark released
          await tx.inventoryReservation.update({
            where: { id: resv.id },
            data: { isReleased: true },
          });

          // Movement log
          await tx.inventoryMovement.create({
            data: {
              variantId: resv.variantId,
              quantity: resv.quantity,
              type: "RELEASE",
              notes: `Auto-released expired reservation ${resv.id}`,
            },
          });
        });
      } catch (innerErr: unknown) {
        logger.error(`[Inventory] Failed to release reservation ${resv.id}`, {
          message: innerErr instanceof Error ? innerErr.message : String(innerErr),
        });
      }
    }
  } catch (err: unknown) {
    logger.error("[Inventory] Auto-release batch failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

// Background scheduler
export function startInventoryScheduler() {
  const FIVE_MINUTES = 5 * 60 * 1000;
  setInterval(() => {
    releaseExpiredReservations().catch((err: unknown) => {
      logger.error("[Inventory] Reservation release scheduler failed", {
        message: err instanceof Error ? err.message : String(err),
      });
    });
  }, FIVE_MINUTES);
}

export default router;
