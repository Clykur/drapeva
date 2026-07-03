// ============================================================
// DRAPEVA — Structured Logger
// Produces JSON log lines in production, human-readable in dev
// ============================================================

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  requestId?: string;
  userId?: string;
  orderId?: string;
  paymentId?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const prefix = { info: "ℹ️", warn: "⚠️", error: "❌", debug: "🐛" }[level];
    const ctx = Object.keys(context).length ? ` ${JSON.stringify(context)}` : "";
    console[level === "debug" ? "log" : level](`${prefix} [${entry.timestamp}] ${message}${ctx}`);
  } else {
    // Production: structured JSON per line (for log aggregators)
    console[level === "debug" ? "log" : level](JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log("info", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  error: (message: string, context?: LogContext) => log("error", message, context),
  debug: (message: string, context?: LogContext) => log("debug", message, context),
};
