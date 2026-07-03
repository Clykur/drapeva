import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middlewares/error.js";
import { idempotency } from "./middlewares/idempotency.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import appointmentRoutes from "./routes/appointment.js";
import blogRoutes from "./routes/blog.js";
import supportRoutes from "./routes/support.js";
import paymentRoutes from "./routes/payment.js";
import shiprocketRoutes from "./routes/shiprocket.js";
import inventoryRoutes from "./routes/inventory.js";
import customerRoutes from "./routes/customer.js";
import adminRoutes from "./routes/admin.js";
import securityRoutes from "./routes/security.js";
import prisma from "./config/prisma.js";
import { getRedisStatus } from "./services/redis.js";
import { logger } from "./utils/logger.js";

const app = express();

// Trust proxy for rate limiter behind next.js rewrites
app.set("trust proxy", 1);

// Security: Helmet headers with custom CSP and HSTS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.supabase.co"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://app.shiprocket.in"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
  }),
);

// Custom security headers
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  // Distributed tracing request ID
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", requestId as string);
  next();
});

// Logging: Structured request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = (req.headers["x-request-id"] as string) || crypto.randomUUID();
  res.on("finish", () => {
    logger.info(`${req.method} ${req.originalUrl}`, {
      requestId,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
});

// Security: Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", limiter);

// Strict rate limiter for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // tightened from 30 to 20
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login/registration attempts, please try again after 15 minutes" },
});

// Strict rate limiter for Payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many payment requests, please try again after 10 minutes" },
});

// CORS Middlewares
const rawFrontendUrl = process.env.FRONTEND_URL;
const cleanFrontendUrl = rawFrontendUrl ? rawFrontendUrl.replace(/\/$/, "") : null;
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000", cleanFrontendUrl].filter(
  Boolean,
) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(idempotency);

// REST Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payments", paymentLimiter, paymentRoutes);
app.use("/api/shiprocket", shiprocketRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/security", securityRoutes);

// Health check & Production readiness check
app.get(["/health", "/api/health"], async (req: Request, res: Response) => {
  const redisInfo = getRedisStatus();
  let dbHealthy: boolean;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch (_err) {
    dbHealthy = false;
  }

  res.json({
    status: dbHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: dbHealthy ? "up" : "down",
      cache: redisInfo.isConnected ? "up" : "down",
    },
  });
});

app.get("/api/health/readiness", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ready" });
  } catch (err: unknown) {
    res.status(503).json({
      status: "not_ready",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// Error handling
app.use(errorHandler);

export default app;
