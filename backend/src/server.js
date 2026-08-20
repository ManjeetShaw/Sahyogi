import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[server] Sahyogi API running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`[server] ${signal} received, shutting down gracefully...`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log("[server] MongoDB connection closed.");
        } catch (err) {
          console.error("[server] Error closing MongoDB connection:", err.message);
        } finally {
          process.exit(0);
        }
      });
      // Force-exit if graceful shutdown hangs (e.g. a stuck request).
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  }
}

start();