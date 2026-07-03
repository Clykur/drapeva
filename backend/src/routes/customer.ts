/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth.js";

const router = Router();

// 1. Add/Get Recently Viewed
router.post(
  "/recently-viewed",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    try {
      const rv = await prisma.recentlyViewed.upsert({
        where: {
          userId_productId: {
            userId: req.user!.id,
            productId,
          },
        },
        update: {
          createdAt: new Date(),
        },
        create: {
          userId: req.user!.id,
          productId,
        },
      });
      res.status(201).json(rv);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/recently-viewed",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.recentlyViewed.findMany({
        where: { userId: req.user!.id },
        include: { product: { include: { images: true } } },
        orderBy: { createdAt: "desc" },
        take: 12,
      });
      res.json(items.map((i) => i.product));
    } catch (err) {
      next(err);
    }
  },
);

// 2. Add/Get Recent Searches
router.post(
  "/recent-searches",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { keyword } = req.body;
    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ error: "keyword is required" });
    }

    try {
      const search = await prisma.recentSearch.create({
        data: {
          userId: req.user!.id,
          keyword: keyword.trim(),
        },
      });
      res.status(201).json(search);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/recent-searches",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const searches = await prisma.recentSearch.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      res.json(Array.from(new Set(searches.map((s) => s.keyword))));
    } catch (err) {
      next(err);
    }
  },
);

// 3. Sync local storage cart to DB
router.post(
  "/cart/sync",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { items } = req.body; // Array of { variantId, quantity }
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "items array is required for sync" });
    }

    try {
      let cart = await prisma.cart.findUnique({
        where: { userId: req.user!.id },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: req.user!.id },
        });
      }

      // Merge strategy: update if exists, insert if not
      for (const item of items) {
        await prisma.cartItem.upsert({
          where: {
            cartId_variantId: {
              cartId: cart.id,
              variantId: item.variantId,
            },
          },
          update: {
            quantity: item.quantity,
          },
          create: {
            cartId: cart.id,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { userId: req.user!.id },
        include: { items: { include: { variant: { include: { product: true } } } } },
      });

      res.json(updatedCart);
    } catch (err) {
      next(err);
    }
  },
);

// 4. Save for Later / Wishlist integration
router.post(
  "/cart/save-for-later",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { variantId } = req.body;
    if (!variantId) return res.status(400).json({ error: "variantId is required" });

    try {
      const cart = await prisma.cart.findUnique({ where: { userId: req.user!.id } });
      if (!cart) return res.status(404).json({ error: "Cart not found" });

      const cartItem = await prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cart.id, variantId } },
        include: { variant: true },
      });

      if (!cartItem) return res.status(404).json({ error: "Item not found in cart" });

      await prisma.$transaction([
        // Add to wishlist
        prisma.wishlist.upsert({
          where: {
            userId_productId: {
              userId: req.user!.id,
              productId: cartItem.variant.productId,
            },
          },
          update: {},
          create: {
            userId: req.user!.id,
            productId: cartItem.variant.productId,
          },
        }),
        // Remove from cart
        prisma.cartItem.delete({
          where: { id: cartItem.id },
        }),
      ]);

      res.json({ success: true, message: "Item saved for later (moved to wishlist)" });
    } catch (err) {
      next(err);
    }
  },
);

// 5. Buy Again
router.get(
  "/buy-again",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await prisma.order.findMany({
        where: { userId: req.user!.id, status: "DELIVERED" },
        include: {
          items: { include: { variant: { include: { product: { include: { images: true } } } } } },
        },
      });

      const productsMap = new Map<string, any>();
      for (const order of orders) {
        for (const item of order.items) {
          const prod = item.variant.product;
          productsMap.set(prod.id, prod);
        }
      }

      res.json(Array.from(productsMap.values()));
    } catch (err) {
      next(err);
    }
  },
);

export default router;
