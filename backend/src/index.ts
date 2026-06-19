import dotenv from "dotenv";
dotenv.config();

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
