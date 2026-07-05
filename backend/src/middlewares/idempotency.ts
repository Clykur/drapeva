/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { supabase } from "../services/supabase.js";

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
    // Attempt to insert a placeholder atomically
    let existing;
    const { error: insErr } = await supabase.from("IdempotencyRequest").insert({
      id: crypto.randomUUID(),
      key,
      responseStatus: 102, // Processing
      responseBody: JSON.stringify({ status: "processing" }),
    });

    if (insErr) {
      // Unique constraint failed or other error. It means the key is already processing or done.
      const { data } = await supabase
        .from("IdempotencyRequest")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      existing = data;

      if (existing) {
        if (existing.responseStatus === 102) {
          logger.info(`[Idempotency] Key: ${key} is already in progress.`);
          return res
            .status(409)
            .json({ error: "Request with this idempotency key is already in progress" });
        }
        logger.info(`[Idempotency] Key match found: ${key}. Returning cached response.`);
        return res
          .status(existing.responseStatus)
          .set("X-Cache-Idempotency", "true")
          .json(JSON.parse(existing.responseBody));
      }
      throw insErr;
    }

    // Intercept res.json to capture response
    const originalJson = res.json;
    res.json = function (body: any): Response {
      // Restore original res.json
      res.json = originalJson;

      // Only cache successful or client-error responses, avoid caching 5xx server errors
      if (res.statusCode >= 200 && res.statusCode < 500) {
        const bodyString = JSON.stringify(body);
        supabase
          .from("IdempotencyRequest")
          .update({
            responseStatus: res.statusCode,
            responseBody: bodyString,
          })
          .eq("key", key)
          .then(({ error }) => {
            if (error) {
              logger.error(`[Idempotency Error] Failed to update key ${key}`, {
                message: error.message,
              });
            } else {
              logger.info(`[Idempotency] Cached response for key: ${key}`);
            }
          });
      } else {
        // If it failed with 500 or other server error, delete the placeholder so user can retry
        supabase
          .from("IdempotencyRequest")
          .delete()
          .eq("key", key)
          .then(({ error }) => {
            if (error) {
              logger.error(`[Idempotency Error] Failed to delete failed key ${key}`, {
                message: error.message,
              });
            }
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
