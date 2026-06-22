import "./config/env.js";

// Validate required environment variables
const criticalEnv = ["DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const recommendedEnv = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "STRIPE_SECRET_KEY"];

const missingCritical = criticalEnv.filter((envVar) => !process.env[envVar]);
if (missingCritical.length > 0) {
  const timestamp = new Date().toISOString();
  console.error(
    `[${timestamp}] FATAL: Missing critical environment variables: ${missingCritical.join(", ")}. Server cannot start.`
  );
  process.exit(1);
}

const missingRecommended = recommendedEnv.filter((envVar) => !process.env[envVar]);
if (missingRecommended.length > 0) {
  const timestamp = new Date().toISOString();
  console.warn(
    `[${timestamp}] WARNING: Missing recommended environment variables: ${missingRecommended.join(", ")}`
  );
}

import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  DRAPEVA BACKEND SERVER RUNNING         `);
  console.log(`  Port: ${PORT}                          `);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=========================================`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
  });
});
