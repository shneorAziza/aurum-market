import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/error.js";
import authRoutes from "./modules/auth/routes.js";
import productRoutes from "./modules/products/routes.js";
import cartRoutes from "./modules/cart/routes.js";
import orderRoutes from "./modules/orders/routes.js";
import userRoutes from "./modules/users/routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  const allowedOrigins = new Set([env.clientOrigin, "http://127.0.0.1:5173", "http://localhost:5173"]);
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
