import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().min(1)), // Allow custom formats or urls
  PORT: z.coerce.number().default(5001),
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  FRONTEND_URL: z.string().url().default("https://drapeva.com"),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  SHIPROCKET_EMAIL: z.string().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "❌ Environment validation failed:",
    JSON.stringify(result.error.format(), null, 2),
  );
  process.exit(1);
}

export const env = result.data;
export default env;
