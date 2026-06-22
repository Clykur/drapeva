import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${req.method} ${req.originalUrl} -`, err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "An unexpected error occurred";

  if (process.env.NODE_ENV === "production" && statusCode >= 500) {
    message = "An unexpected error occurred";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
