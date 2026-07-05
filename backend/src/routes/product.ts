/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CacheService } from "../services/redis.js";
import { authenticateJWT, requireRole, AuthenticatedRequest } from "../middlewares/auth.js";
import { supabase } from "../services/supabase.js";

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

function mapProduct(p: any) {
  if (!p) return p;

  const images = p.product_images || p.images || [];
  const mappedImages = images.map((img: any) => ({
    id: img.id,
    productId: img.product_id,
    url: img.url,
    altText: img.alt_text,
    isFeatured: img.is_featured,
    sortOrder: img.sort_order,
  }));

  const reviews = p.reviews || [];
  const approvedReviews = reviews
    .filter((r: any) => r.is_approved)
    .map((r: any) => ({ rating: r.rating }));

  return {
    id: p.id,
    productCode: p.product_code,
    product_code: p.product_code,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    salePrice: p.sale_price,
    fabric: p.fabric,
    color: p.color,
    stockQuantity: p.stock_quantity,
    isFeatured: p.is_featured,
    isBestseller: p.is_bestseller,
    isNewArrival: p.is_new_arrival,
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    categoryId: p.category_id,
    collectionId: p.collection_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    images: mappedImages,
    category: p.category || null,
    collection: p.collection || null,
    reviews: approvedReviews,
  };
}

function mapReview(r: any) {
  if (!r) return r;
  return {
    id: r.id,
    productId: r.product_id,
    userId: r.user_id,
    reviewerName: r.reviewer_name,
    reviewerEmail: r.reviewer_email,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    isApproved: r.is_approved,
    helpfulVotes: r.helpful_votes,
    verifiedPurchase: r.verified_purchase,
    moderationStatus: r.moderation_status,
    adminReply: r.admin_reply,
    createdAt: r.created_at,
    user: r.user || null,
    media: r.media || [],
  };
}

// 1. Get Categories
router.get("/categories", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = "maaya:categories";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    await CacheService.set(cacheKey, categories, 3600);
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

    const { data: collections, error } = await supabase
      .from("collections")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

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

    let categoryId = null;
    if (category && category !== "all") {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .maybeSingle();
      if (cat) categoryId = cat.id;
      else return res.json([]);
    }

    let collectionId = null;
    if (collection) {
      const { data: col } = await supabase
        .from("collections")
        .select("id")
        .eq("slug", collection)
        .maybeSingle();
      if (col) collectionId = col.id;
      else return res.json([]);
    }

    let q = supabase
      .from("products")
      .select("*, product_images(*), reviews(*)");

    if (categoryId) q = q.eq("category_id", categoryId);
    if (collectionId) q = q.eq("collection_id", collectionId);
    if (fabric) q = q.eq("fabric", fabric);
    if (minPrice) q = q.gte("price", parseFloat(minPrice as string));
    if (maxPrice) q = q.lte("price", parseFloat(maxPrice as string));

    if (query) {
      q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%,fabric.ilike.%${query}%,product_code.ilike.%${query}%`);
    }

    if (sort === "price-asc") q = q.order("price", { ascending: true });
    else if (sort === "price-desc") q = q.order("price", { ascending: false });
    else q = q.order("created_at", { ascending: false });

    const { data: products, error } = await q;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(products.map(mapProduct));
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

    // Try finding by UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id as string);
    let q = supabase
      .from("products")
      .select("*, product_images(*), category:categories(*), collection:collections(*), reviews(*)");

    if (isUuid) {
      q = q.or(`id.eq.${id},slug.eq.${id}`);
    } else {
      q = q.eq("slug", id);
    }

    const { data: product, error } = await q.maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const mapped = mapProduct(product);
    await CacheService.set(cacheKey, mapped, 1800); // 30 mins
    res.json(mapped);
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

      const { data: p, error: prodErr } = await supabase
        .from("products")
        .insert({
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          sale_price: data.salePrice ?? null,
          fabric: data.fabric ?? null,
          color: data.color ?? null,
          stock_quantity: data.stockQuantity ?? 0,
          is_featured: data.isFeatured ?? false,
          is_bestseller: data.isBestseller ?? false,
          is_new_arrival: data.isNewArrival ?? false,
          seo_title: data.seoTitle ?? null,
          seo_description: data.seoDescription ?? null,
          category_id: data.categoryId ?? null,
          collection_id: data.collectionId ?? null,
        })
        .select()
        .single();

      if (prodErr || !p) {
        return res.status(500).json({ error: prodErr?.message || "Failed to create product" });
      }

      // Create images
      const { error: imgErr } = await supabase.from("product_images").insert(
        data.images.map((img, i) => ({
          product_id: p.id,
          url: img.url,
          alt_text: img.altText || p.name,
          is_featured: img.isFeatured || i === 0,
          sort_order: img.sortOrder ?? i,
        }))
      );

      if (imgErr) {
        return res.status(500).json({ error: imgErr.message });
      }

      await CacheService.clearPattern("maaya:product:*");
      res.status(201).json(mapProduct(p));
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

      const { data: p, error: prodErr } = await supabase
        .from("products")
        .update({
          name: data.name,
          slug,
          description: data.description,
          price: data.price,
          sale_price: data.salePrice ?? null,
          fabric: data.fabric ?? null,
          color: data.color ?? null,
          stock_quantity: data.stockQuantity ?? 0,
          is_featured: data.isFeatured ?? false,
          is_bestseller: data.isBestseller ?? false,
          is_new_arrival: data.isNewArrival ?? false,
          seo_title: data.seoTitle ?? null,
          seo_description: data.seoDescription ?? null,
          category_id: data.categoryId ?? null,
          collection_id: data.collectionId ?? null,
        })
        .eq("id", id)
        .select()
        .single();

      if (prodErr || !p) {
        return res.status(500).json({ error: prodErr?.message || "Failed to update product" });
      }

      // Sync images
      await supabase.from("product_images").delete().eq("product_id", id);
      const { error: imgErr } = await supabase.from("product_images").insert(
        data.images.map((img, i) => ({
          product_id: p.id,
          url: img.url,
          alt_text: img.altText || p.name,
          is_featured: img.isFeatured || i === 0,
          sort_order: img.sortOrder ?? i,
        }))
      );

      if (imgErr) {
        return res.status(500).json({ error: imgErr.message });
      }

      await CacheService.del(`maaya:product:${id}`);
      await CacheService.clearPattern("maaya:product:*");

      res.json(mapProduct(p));
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
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Invalidate caches
      await CacheService.del(`maaya:product:${id}`);
      await CacheService.clearPattern("maaya:product:*");

      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
);

// 8. Submit Review (Customer Only)
router.post(
  "/:id/reviews",
  authenticateJWT,
  requireRole(["CUSTOMER"]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const reqAny = req as any;
    const { id } = reqAny.params;
    const { rating, title, comment, media } = reqAny.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    try {
      // Check verified purchase status
      const { data: deliveredOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", reqAny.user!.id)
        .eq("status", "delivered");

      let verifiedPurchase = false;
      if (deliveredOrders && deliveredOrders.length > 0) {
        verifiedPurchase = deliveredOrders.some((order: any) => {
          const items = Array.isArray(order.items) ? order.items : [];
          return items.some((item: any) => item.product_id === id || item.productId === id);
        });
      }

      const { data: review, error: revErr } = await supabase
        .from("reviews")
        .insert({
          user_id: reqAny.user!.id,
          product_id: id,
          rating,
          title: title ? title : null,
          comment: comment ? comment : null,
          verified_purchase: verifiedPurchase,
          is_approved: false,
          moderation_status: "PENDING",
        })
        .select()
        .single();

      if (revErr || !review) {
        return res.status(500).json({ error: revErr?.message || "Failed to create review" });
      }

      // Add media if present
      if (media && Array.isArray(media) && media.length > 0) {
        const { error: medErr } = await supabase.from("review_media").insert(
          media.map((item: any) => ({
            review_id: review.id,
            url: item.url,
            type: item.type || "IMAGE",
          }))
        );
        if (medErr) {
          return res.status(500).json({ error: medErr.message });
        }
      }

      res.status(201).json(mapReview(review));
    } catch (err) {
      next(err);
    }
  },
);

// 9. Get Reviews for Product with Sorting & Filtering
router.get("/:id/reviews", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { sort, rating } = req.query;

  try {
    let q = supabase
      .from("reviews")
      .select("*, user:profiles(name), media:review_media(*)")
      .eq("product_id", id)
      .eq("is_approved", true);

    if (rating) {
      q = q.eq("rating", Number(rating));
    }

    if (sort === "highest_rating") {
      q = q.order("rating", { ascending: false });
    } else if (sort === "lowest_rating") {
      q = q.order("rating", { ascending: true });
    } else if (sort === "helpful") {
      q = q.order("helpful_votes", { ascending: false });
    } else {
      q = q.order("created_at", { ascending: false });
    }

    const { data: reviews, error } = await q;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(reviews.map(mapReview));
  } catch (err) {
    next(err);
  }
});

// 10. Vote Review Helpful
router.post(
  "/reviews/:reviewId/helpful",
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params as { reviewId: string };
    try {
      // First get current votes
      const { data: review } = await supabase
        .from("reviews")
        .select("helpful_votes")
        .eq("id", reviewId)
        .maybeSingle();

      const currentVotes = review?.helpful_votes || 0;

      const { data: updatedReview, error } = await supabase
        .from("reviews")
        .update({
          helpful_votes: currentVotes + 1,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(mapReview(updatedReview));
    } catch (err) {
      next(err);
    }
  },
);

// 11. Admin Reply to Review (Admin Only)
router.post(
  "/reviews/:reviewId/reply",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params as { reviewId: string };
    const { reply } = req.body;

    if (!reply) return res.status(400).json({ error: "Reply comment is required" });

    try {
      const { data: updatedReview, error } = await supabase
        .from("reviews")
        .update({
          admin_reply: reply,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(mapReview(updatedReview));
    } catch (err) {
      next(err);
    }
  },
);

// 12. Admin Moderate Review (Admin Only)
router.post(
  "/reviews/:reviewId/moderate",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params as { reviewId: string };
    const { status } = req.body; // APPROVED or REJECTED

    if (!status || (status !== "APPROVED" && status !== "REJECTED")) {
      return res.status(400).json({ error: "Status must be APPROVED or REJECTED" });
    }

    try {
      const { data: updatedReview, error } = await supabase
        .from("reviews")
        .update({
          is_approved: status === "APPROVED",
          moderation_status: status,
        })
        .eq("id", reviewId)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(mapReview(updatedReview));
    } catch (err) {
      next(err);
    }
  },
);

export default router;
