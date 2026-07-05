/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Response, NextFunction } from "express";
import { authenticateJWT, AuthenticatedRequest } from "../middlewares/auth.js";
import { supabase } from "../services/supabase.js";

const router = Router();

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
  };
}

async function getCartResponse(userId: string) {
  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select("*, product:products(*, product_images(*))")
    .eq("user_id", userId);

  if (error) throw error;

  const items = [];
  for (const item of cartItems || []) {
    const { data: variant } = await supabase
      .from("ProductVariant")
      .select("*")
      .eq("productId", item.product_id)
      .eq("size", item.size)
      .maybeSingle();

    if (variant) {
      items.push({
        id: item.id,
        cartId: userId,
        variantId: variant.id,
        quantity: item.quantity,
        variant: {
          id: variant.id,
          productId: variant.productId,
          size: variant.size,
          sku: variant.sku,
          stock: variant.stock,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            description: item.product.description,
            price: item.product.price,
            salePrice: item.product.sale_price,
            fabric: item.product.fabric,
            color: item.product.color,
            stockQuantity: item.product.stock_quantity,
            isFeatured: item.product.is_featured,
            isBestseller: item.product.is_bestseller,
            isNewArrival: item.product.is_new_arrival,
            seoTitle: item.product.seo_title,
            seoDescription: item.product.seo_description,
            images: (item.product.product_images || []).map((img: any) => ({
              id: img.id,
              url: img.url,
              altText: img.alt_text,
              isFeatured: img.is_featured,
            })),
          },
        },
      });
    }
  }

  return {
    id: userId,
    userId: userId,
    items,
  };
}

// 1. Add/Get Recently Viewed
router.post(
  "/recently-viewed",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: "productId is required" });

    try {
      const { data: rv, error } = await supabase
        .from("RecentlyViewed")
        .upsert({
          userId: req.user!.id,
          productId,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

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
      const { data: items, error } = await supabase
        .from("RecentlyViewed")
        .select("productId, product:products(*, product_images(*))")
        .eq("userId", req.user!.id)
        .order("createdAt", { ascending: false })
        .limit(12);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const products = (items || [])
        .map((i: any) => i.product)
        .filter(Boolean)
        .map(mapProduct);

      res.json(products);
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
      const { data: search, error } = await supabase
        .from("RecentSearch")
        .insert({
          userId: req.user!.id,
          keyword: keyword.trim(),
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

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
      const { data: searches, error } = await supabase
        .from("RecentSearch")
        .select("*")
        .eq("userId", req.user!.id)
        .order("createdAt", { ascending: false })
        .limit(10);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json(Array.from(new Set(searches.map((s: any) => s.keyword))));
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
      for (const item of items) {
        const { data: variant } = await supabase
          .from("ProductVariant")
          .select("productId, size")
          .eq("id", item.variantId)
          .maybeSingle();

        if (variant) {
          await supabase.from("cart_items").upsert(
            {
              user_id: req.user!.id,
              product_id: variant.productId,
              quantity: item.quantity,
              size: variant.size,
            },
            {
              onConflict: "user_id,product_id,size",
            },
          );
        }
      }

      const cartRes = await getCartResponse(req.user!.id);
      res.json(cartRes);
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
      const { data: variant } = await supabase
        .from("ProductVariant")
        .select("productId, size")
        .eq("id", variantId)
        .maybeSingle();

      if (!variant) return res.status(404).json({ error: "Item not found in cart" });

      const { data: cartItem } = await supabase
        .from("cart_items")
        .select("id")
        .eq("user_id", req.user!.id)
        .eq("product_id", variant.productId)
        .eq("size", variant.size)
        .maybeSingle();

      if (!cartItem) return res.status(404).json({ error: "Item not found in cart" });

      // Add to wishlist
      await supabase.from("wishlist").upsert(
        {
          user_id: req.user!.id,
          product_id: variant.productId,
        },
        {
          onConflict: "user_id,product_id",
        },
      );

      // Remove from cart
      await supabase.from("cart_items").delete().eq("id", cartItem.id);

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
      const { data: orders, error } = await supabase
        .from("orders")
        .select("items")
        .eq("user_id", req.user!.id)
        .eq("status", "delivered");

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const productIds = new Set<string>();
      for (const order of orders || []) {
        const items = Array.isArray(order.items) ? order.items : [];
        for (const item of items) {
          if (item.product_id) productIds.add(item.product_id);
          else if (item.productId) productIds.add(item.productId);
        }
      }

      if (productIds.size === 0) {
        return res.json([]);
      }

      const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .in("id", Array.from(productIds));

      if (prodErr) {
        return res.status(500).json({ error: prodErr.message });
      }

      res.json((products || []).map(mapProduct));
    } catch (err) {
      next(err);
    }
  },
);

export default router;
