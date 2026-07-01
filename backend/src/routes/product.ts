import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { CacheService } from "../services/redis.js";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "../middlewares/auth.js";

const router = Router();

// Validation Schema for product CRUD
const ProductInputSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(1),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  fabric: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  stockQuantity: z.number().int().nonnegative().default(0),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        altText: z.string().optional(),
        isFeatured: z.boolean().optional(),
        sortOrder: z.number().int().optional(),
      }),
    )
    .min(1, "At least one image is required"),
});

// 1. Get Categories
router.get("/categories", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = "maaya:categories";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const categories = await prisma.category.findMany();
    await CacheService.set(cacheKey, categories, 3600); // cache for 1 hr
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// 2. Get Collections
router.get("/collections", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = "maaya:collections";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const collections = await prisma.collection.findMany();
    await CacheService.set(cacheKey, collections, 3600);
    res.json(collections);
  } catch (err) {
    next(err);
  }
});

// 3. Get Products (Filtered + Paginated + Searched)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, collection, fabric, query, sort, minPrice, maxPrice } = req.query;

    const where: any = {};

    if (category && category !== "all") {
      where.category = { slug: category as string };
    }
    if (collection) {
      where.collection = { slug: collection as string };
    }
    if (fabric) {
      where.fabric = fabric as string;
    }
    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: "insensitive" } },
        { description: { contains: query as string, mode: "insensitive" } },
        { fabric: { contains: query as string, mode: "insensitive" } },
        { productCode: { contains: query as string, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      orderBy,
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
});

// 4. Get Single Product by slug/id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const cacheKey = `maaya:product:${id}`;

  try {
    const cached = await CacheService.get<any>(cacheKey);
    if (cached) return res.json(cached);

    const product = await prisma.product.findFirst({
      where: { OR: [{ id: id as string }, { slug: id as string }] },
      include: {
        images: true,
        category: true,
        collection: true,
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await CacheService.set(cacheKey, product, 1800); // 30 mins
    res.json(product);
  } catch (err) {
    next(err);
  }
});

  // 5. Create Product (Admin Only)
router.post(
  "/",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = ProductInputSchema.parse(req.body);
      const slug =
        data.slug ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const product = await prisma.$transaction(async (tx: any) => {
        const p = await tx.product.create({
          data: {
            name: data.name,
            slug,
            description: data.description,
            price: data.price,
            salePrice: data.salePrice ?? null,
            fabric: data.fabric ?? null,
            color: data.color ?? null,
            stockQuantity: data.stockQuantity ?? 0,
            isFeatured: data.isFeatured ?? false,
            isBestseller: data.isBestseller ?? false,
            isNewArrival: data.isNewArrival ?? false,
            seoTitle: data.seoTitle ?? null,
            seoDescription: data.seoDescription ?? null,
            categoryId: data.categoryId ?? null,
            collectionId: data.collectionId ?? null,
            // product_code is auto-generated by DB trigger
          },
        });

        // Create images
        await tx.productImage.createMany({
          data: data.images.map((img, i) => ({
            productId: p.id,
            url: img.url,
            altText: img.altText || p.name,
            isFeatured: img.isFeatured || i === 0,
            sortOrder: img.sortOrder ?? i,
          })),
        });

        return p;
      });

      await CacheService.clearPattern("maaya:product:*");
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  },
);

// 6. Update Product (Admin Only)
router.put(
  "/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const data = ProductInputSchema.parse(req.body);
      const slug =
        data.slug ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const product = await prisma.$transaction(async (tx: any) => {
        const p = await tx.product.update({
          where: { id },
          data: {
            name: data.name,
            slug,
            description: data.description,
            price: data.price,
            salePrice: data.salePrice ?? null,
            fabric: data.fabric ?? null,
            color: data.color ?? null,
            stockQuantity: data.stockQuantity ?? 0,
            isFeatured: data.isFeatured ?? false,
            isBestseller: data.isBestseller ?? false,
            isNewArrival: data.isNewArrival ?? false,
            seoTitle: data.seoTitle ?? null,
            seoDescription: data.seoDescription ?? null,
            categoryId: data.categoryId ?? null,
            collectionId: data.collectionId ?? null,
          },
        });

        // Sync images
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: data.images.map((img, i) => ({
            productId: p.id,
            url: img.url,
            altText: img.altText || p.name,
            isFeatured: img.isFeatured || i === 0,
            sortOrder: img.sortOrder ?? i,
          })),
        });

        return p;
      });

      await CacheService.del(`maaya:product:${id}`);
      await CacheService.clearPattern("maaya:product:*");

      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  },
);

// 7. Delete Product (Admin Only)
router.delete(
  "/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      await prisma.product.delete({ where: { id: id as string } });

      // Invalidate caches
      await CacheService.del(`maaya:product:${id}`);
      await CacheService.clearPattern("maaya:product:*");

      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
);

import { escapeHTML } from "../utils/sanitize.js";

// 8. Submit Review (Customer Only)
router.post(
  "/:id/reviews",
  authenticateJWT,
  requireRole(["CUSTOMER"]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const reqAny = req as any;
    const { id } = reqAny.params;
    const { rating, title, comment } = reqAny.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
      const review = await prisma.review.create({
        data: {
          userId: reqAny.user!.id,
          productId: id,
          rating,
          title: title ? escapeHTML(title) : null,
          comment: comment ? escapeHTML(comment) : null,
          isApproved: false, // Moderation required
        },
      });

      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  },
);

// 9. Get Approved Reviews for Product
router.get("/:id/reviews", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: id as string, isApproved: true },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

export default router;
