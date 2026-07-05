/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { logger } from "../utils/logger.js";
import { supabase } from "../services/supabase.js";

const router = Router();

// 1. Reserve Stock during checkout
router.post(
  "/reserve",
  authenticateJWT,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { variantId, quantity, expiresMinutes } = req.body;
    if (!variantId || !quantity) {
      return res.status(400).json({ error: "variantId and quantity are required" });
    }

    const minutes = expiresMinutes || 15;
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();

    try {
      const { data: reservation, error } = await supabase.rpc("reserve_inventory_atomic", {
        p_variant_id: variantId,
        p_quantity: Number(quantity),
        p_expires_at: expiresAt,
      });

      if (error || !reservation) {
        return res.status(400).json({ error: error?.message || "Stock reservation failed" });
      }

      // Map back to Prisma camelCase naming style
      const mappedReservation = {
        id: reservation.id,
        variantId: reservation.variant_id,
        quantity: reservation.quantity,
        expiresAt: reservation.expires_at,
        isReleased: reservation.is_released,
        createdAt: reservation.created_at,
      };

      res.status(201).json(mappedReservation);
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
      const { data: reservation, error } = await supabase.rpc("release_reservation_atomic", {
        p_reservation_id: reservationId,
      });

      if (error || !reservation) {
        return res.status(400).json({ error: error?.message || "Releasing reservation failed" });
      }

      // Map back to Prisma camelCase naming style
      const mappedReservation = {
        id: reservation.id,
        variantId: reservation.variant_id,
        quantity: reservation.quantity,
        expiresAt: reservation.expires_at,
        isReleased: reservation.is_released,
        createdAt: reservation.created_at,
      };

      res.json(mappedReservation);
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
      const { data: movements, error } = await supabase
        .from("inventory_movements")
        .select("*, variant:ProductVariant(*, product:products(*))")
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Map to camelCase style
      const mappedMovements = movements.map((m: any) => ({
        id: m.id,
        variantId: m.variant_id,
        quantity: m.quantity,
        type: m.type,
        notes: m.notes,
        createdAt: m.created_at,
        variant: m.variant ? {
          id: m.variant.id,
          productId: m.variant.productId,
          size: m.variant.size,
          sku: m.variant.sku,
          stock: m.variant.stock,
          product: m.variant.product ? {
            id: m.variant.product.id,
            name: m.variant.product.name,
            slug: m.variant.product.slug,
            description: m.variant.product.description,
            price: m.variant.product.price,
            stockQuantity: m.variant.product.stock_quantity,
          } : null
        } : null,
      }));

      res.json(mappedMovements);
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
    const { updates } = req.body;
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "updates array is required" });
    }

    try {
      for (const update of updates) {
        const { variantId, quantity } = update;
        const { data: variant } = await supabase
          .from("ProductVariant")
          .select("stock")
          .eq("id", variantId)
          .maybeSingle();

        if (!variant) throw new Error(`Variant ${variantId} not found`);

        const difference = quantity - (variant.stock || 0);

        const { error: updErr } = await supabase
          .from("ProductVariant")
          .update({ stock: quantity })
          .eq("id", variantId);

        if (updErr) throw updErr;

        const { error: movErr } = await supabase.from("inventory_movements").insert({
          variant_id: variantId,
          quantity: difference,
          type: "BULK_UPDATE",
          notes: `Bulk stock update from ${variant.stock} to ${quantity}`,
        });

        if (movErr) throw movErr;
      }

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
      const { data: inventory, error } = await supabase
        .from("ProductVariant")
        .select("*, product:products(*)");

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const mapped = inventory.map((v: any) => ({
        id: v.id,
        productId: v.productId,
        size: v.size,
        sku: v.sku,
        stock: v.stock,
        product: v.product ? {
          id: v.product.id,
          name: v.product.name,
          slug: v.product.slug,
          price: v.product.price,
          stockQuantity: v.product.stock_quantity,
        } : null
      }));

      res.json(mapped);
    } catch (err) {
      next(err);
    }
  },
);

// Helper to release expired reservations automatically
export async function releaseExpiredReservations() {
  try {
    const { data: releasedCount, error } = await supabase.rpc("release_expired_reservations_atomic");
    if (error) throw error;

    if (releasedCount && releasedCount > 0) {
      logger.info(`[Inventory] Auto-released ${releasedCount} expired reservations`);
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
