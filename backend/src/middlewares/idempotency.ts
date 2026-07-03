/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { logger } from "../utils/logger.js";

export async function idempotency(req: Request, res: Response, next: NextFunction) {
  // Only apply to mutating requests (POST/PATCH/PUT/DELETE)
  if (!["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    return next();
  }

  const key = req.headers["idempotency-key"];
  if (!key || typeof key !== "string") {
    return next();
  }

  try {
    const prismaAny = prisma as any;
    // Check if key already processed
    const existing = await prismaAny.idempotencyRequest.findUnique({
      where: { key },
    });

    if (existing) {
      logger.info(`[Idempotency] Key match found: ${key}. Returning cached response.`);
      return res
        .status(existing.responseStatus)
        .set("X-Cache-Idempotency", "true")
        .json(JSON.parse(existing.responseBody));
    }

    // Intercept res.json to capture response
    const originalJson = res.json;
    res.json = function (body: any): Response {
      // Restore original res.json
      res.json = originalJson;

      // Only cache successful or client-error responses, avoid caching 5xx server errors
      if (res.statusCode >= 200 && res.statusCode < 500) {
        const bodyString = JSON.stringify(body);
        prismaAny.idempotencyRequest
          .create({
            data: {
              id: crypto.randomUUID(),
              key,
              responseStatus: res.statusCode,
              responseBody: bodyString,
            },
          })
          .then(() => {
            logger.info(`[Idempotency] Cached response for key: ${key}`);
          })
          .catch((err: unknown) => {
            logger.error(`[Idempotency Error] Failed to save key ${key}`, {
              message: err instanceof Error ? err.message : String(err),
            });
          });
      }

      return originalJson.call(this, body);
    };

    next();
  } catch (err: unknown) {
    logger.error("[Idempotency Middleware Error]", {
      message: err instanceof Error ? err.message : String(err),
    });
    next();
  }
}
