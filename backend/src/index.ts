import "./config/env.js";
import app from "./app.js";
import { startBackupScheduler } from "./utils/backup.js";
import { startInventoryScheduler } from "./routes/inventory.js";
import { initializeDatabase } from "./config/prisma.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

// Initialize DB extensions and start background schedulers
initializeDatabase().catch((err) => logger.error("DB Init failed", { message: err.message }));
startBackupScheduler();
startInventoryScheduler();

const server = app.listen(PORT, () => {
  logger.info("DRAPEVA Backend Server started", {
    port: Number(PORT),
    env: process.env.NODE_ENV || "development",
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received — shutting down gracefully");
  server.close(() => {
    logger.info("Server shut down cleanly");
  });
});
