import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { errorHandler } from "./middlewares/error.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import appointmentRoutes from "./routes/appointment.js";
import blogRoutes from "./routes/blog.js";
import supportRoutes from "./routes/support.js";
import paymentRoutes from "./routes/payment.js";

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
        styleSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "no-referrer",
    },
  })
);

// Custom security headers
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Logging: Custom request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
    );
  });
  next();
});

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
});
app.use("/api", limiter);

// Strict rate limiter for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login/registration attempts, please try again after 15 minutes" },
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

// REST Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/payments", paymentRoutes);

// Health check
app.get(["/health", "/api/health"], (req: any, res: any) => {
  res.json({ status: "ok" });
});

// Error handling
app.use(errorHandler);

export default app;
