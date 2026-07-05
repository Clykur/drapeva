/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CacheService } from "../services/redis.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";
import { supabase } from "../services/supabase.js";

const router = Router();

const PostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  image: z.string().url(),
  category: z.string(),
  author: z.string(),
  isPublished: z.boolean().optional(),
});

function mapPost(post: any) {
  if (!post) return post;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    image: post.image,
    category: post.category,
    author: post.author,
    isPublished: post.is_published,
    createdAt: post.created_at,
  };
}

// 1. Get Blog Posts
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = "maaya:blog:all";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const mappedPosts = posts.map(mapPost);
    await CacheService.set(cacheKey, mappedPosts, 1800);
    res.json(mappedPosts);
  } catch (err) {
    next(err);
  }
});

// 2. Get Single Blog Post by slug
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  const { slug } = req.params;
  const cacheKey = `maaya:blog:${slug}`;

  try {
    const cached = await CacheService.get<any>(cacheKey);
    if (cached) return res.json(cached);

    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug as string)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!post) return res.status(404).json({ error: "Blog post not found" });

    const mappedPost = mapPost(post);
    await CacheService.set(cacheKey, mappedPost, 1800);
    res.json(mappedPost);
  } catch (err) {
    next(err);
  }
});

// 3. Create Blog Post (Admin Only)
router.post(
  "/",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = PostSchema.parse(req.body);
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const { data: post, error } = await supabase
        .from("blog_posts")
        .insert({
          title: data.title,
          slug,
          content: data.content,
          image: data.image,
          category: data.category,
          author: data.author,
          is_published: data.isPublished || false,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Invalidate caches
      await CacheService.del("maaya:blog:all");

      res.status(201).json(mapPost(post));
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  },
);

// 4. Update Blog Post (Admin Only)
router.put(
  "/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const data = PostSchema.parse(req.body);
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const { data: post, error } = await supabase
        .from("blog_posts")
        .update({
          title: data.title,
          slug,
          content: data.content,
          image: data.image,
          category: data.category,
          author: data.author,
          is_published: data.isPublished,
        })
        .eq("id", id as string)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Invalidate caches
      await CacheService.del("maaya:blog:all");
      await CacheService.del(`maaya:blog:${slug}`);

      res.json(mapPost(post));
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      next(err);
    }
  },
);

// 5. Delete Blog Post (Admin Only)
router.delete(
  "/:id",
  authenticateJWT,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id as string)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Invalidate caches
      await CacheService.del("maaya:blog:all");
      await CacheService.del(`maaya:blog:${post.slug}`);

      res.json({ message: "Post deleted successfully" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
