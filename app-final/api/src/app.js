import { Hono } from "hono";
import { cors } from "hono/cors";
import { COMPANY } from "./company.js";
import { createDb, migrate } from "./db.js";
import { authRoutes, userRoutes } from "./routes/users.js";
import { notificationRoutes, ticketRoutes } from "./routes/tickets.js";

export async function createApp() {
  const db = createDb();
  await migrate(db);

  const app = new Hono();
  app.use(
    "*",
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  app.get("/health", (c) =>
    c.json({ ok: true, service: "aether-desk-api", company: COMPANY.nomeFantasia })
  );

  app.route("/auth", authRoutes(db));
  app.route("/users", userRoutes(db));
  app.route("/tickets", ticketRoutes(db));
  app.route("/notifications", notificationRoutes(db));

  return app;
}
