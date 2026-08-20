// import express from "express";
// import cors from "cors";
// import morgan from "morgan";

// import authRoutes from "./routes/authRoutes.js";
// import issueRoutes from "./routes/issueRoutes.js";
// import serviceRoutes from "./routes/serviceRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorHandler.js";

// const app = express();

// const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
//   .split(",")
//   .map((o) => o.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow non-browser requests (e.g. curl, server-to-server) with no origin header
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error(`CORS: origin ${origin} not allowed`));
//       }
//     },
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "2mb" }));
// if (process.env.NODE_ENV !== "test") {
//   app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
// }

// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", service: "Sahyogi API", time: new Date().toISOString() });
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/issues", issueRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/ai", aiRoutes);

// app.use(notFound);
// app.use(errorHandler);

// export default app;



import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g. curl, server-to-server) with no origin header
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

const MONGOOSE_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

// This must never claim "ok" if MongoDB isn't actually reachable - a health
// check that just returns a static 200 gives false confidence to uptime
// monitors and to anyone debugging "why is data missing" in production.
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = MONGOOSE_STATES[dbState] || "unknown";
  const healthy = dbState === 1;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "Sahyogi API",
    time: new Date().toISOString(),
    database: dbStatus,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;


