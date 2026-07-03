/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../config/prisma.js";
import { CacheService } from "../services/redis.js";
import { authenticateJWT, requireRole } from "../middlewares/auth.js";

const router = Router();

const PostSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(20),
  image: z.string().url(),
  category: z.string(),
  author: z.string(),
  isPublished: z.boolean().optional(),
});

// 1. Get Blog Posts
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = "maaya:blog:all";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    await CacheService.set(cacheKey, posts, 1800);
    res.json(posts);
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

    const post = await prisma.blogPost.findUnique({
      where: { slug: slug as string },
    });

    if (!post) return res.status(404).json({ error: "Blog post not found" });

    await CacheService.set(cacheKey, post, 1800);
    res.json(post);
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

      const post = await prisma.blogPost.create({
        data: {
          title: data.title,
          slug,
          content: data.content,
          image: data.image,
          category: data.category,
          author: data.author,
          isPublished: data.isPublished || false,
        },
      });

      // Invalidate caches
      await CacheService.del("maaya:blog:all");

      res.status(201).json(post);
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

      const post = await prisma.blogPost.update({
        where: { id: id as string },
        data: {
          title: data.title,
          slug,
          content: data.content,
          image: data.image,
          category: data.category,
          author: data.author,
          isPublished: data.isPublished,
        },
      });

      // Invalidate caches
      await CacheService.del("maaya:blog:all");
      await CacheService.del(`maaya:blog:${slug}`);

      res.json(post);
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
      const post = await prisma.blogPost.delete({ where: { id: id as string } });

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
