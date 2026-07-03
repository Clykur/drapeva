import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export async function initializeDatabase() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "IdempotencyRequest" (
        "id" TEXT PRIMARY KEY,
        "key" TEXT UNIQUE NOT NULL,
        "responseStatus" INTEGER NOT NULL,
        "responseBody" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    logger.info("[DB] IdempotencyRequest table initialized successfully");
  } catch (err: unknown) {
    logger.warn("[DB Warning] Programmatic table creation skipped or failed", {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

export default prisma;
