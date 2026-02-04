import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth";
import type { Env } from "./middleware/auth";

// Route Imports
import profilesApp from "./routes/profiles";
import marketplaceApp from "./routes/marketplace";
import lostFoundApp from "./routes/lostfound";
import socialApp from "./routes/social";
import foodApp from "./routes/food";
import accommodationApp from "./routes/accommodation";
import dashboardApp from "./routes/dashboard";

const app = new Hono<Env>();

// Global Middleware
app.use("*", logger());
app.use("*", cors({
  origin: 'http://localhost:5173', // Your Vite dev server URL
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
})); // Ideally restrict origin in prod
app.use("/api/*", authMiddleware);

// Health Check
app.get("/", (c) => c.text("Unmarky API is running!"));

// Mount Routes
app.route("/api/profiles", profilesApp);
app.route("/api/marketplace", marketplaceApp);
app.route("/api/lostfound", lostFoundApp);
app.route("/api/social", socialApp);
app.route("/api/food", foodApp); // Read-only
app.route("/api/accommodation", accommodationApp); // Read-only
app.route("/api/dashboard", dashboardApp); // Summary

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
