import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers["x-request-id"] as string) || "unknown";
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`Unhandled error: ${err.message}`, {
    requestId,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  const message =
    process.env.NODE_ENV === "production" && statusCode >= 500
      ? "An unexpected error occurred"
      : err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    error: message,
    requestId,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });

  // Satisfy Next argument requirement — next() not called intentionally
  void next;
}
