import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";
import { isOriginAllowed, validateEnv } from "./env";
import { authMiddleware } from "./middleware/auth";
import { rateLimit } from "./middleware/rateLimit";
import type { Env } from "./middleware/auth";

// Route Imports
import profilesApp from "./routes/profiles";
import marketplaceApp from "./routes/marketplace";
import lostFoundApp from "./routes/lostfound";
import socialApp from "./routes/social";
import foodApp from "./routes/food";
import accommodationApp from "./routes/accommodation";
import dashboardApp from "./routes/dashboard";
import roleRequestsApp from "./routes/roleRequests";
import studyApp from "./routes/study";
import communitiesApp from "./routes/communities";
import accountApp from "./routes/account";

validateEnv();

const app = new Hono<Env>();

// Global Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Same-origin `/api` rewrites send no Origin, and mobile/curl clients
      // don't need CORS headers. Return undefined so nothing is emitted.
      if (!origin) return undefined;

      if (isOriginAllowed(origin)) {
        return origin;
      }

      console.warn(`[CORS] Blocked origin: ${origin}`);
      return undefined;
    },
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    // Cache the preflight for a day to cut round-trips on repeat requests.
    maxAge: 86400,
    credentials: true,
  })
);

// Health check must stay public and ahead of auth.
app.get("/healthz", (c) => c.json({ ok: true }));
app.get("/", (c) => c.text("Unimarky API is running!"));

// Edge/HTTP hardening. The rate limiter is per API instance; pair it with
// Cloudflare (or Upstash) for multi-instance and L3/L4 protection.
app.use("*", secureHeaders());
app.use(
  "/api/*",
  bodyLimit({
    maxSize: 1024 * 1024,
    onError: (c) => c.json({ error: "Payload too large" }, 413),
  })
);
app.use("/api/*", rateLimit({ windowMs: 60_000, max: 180, keyPrefix: "api" }));
app.use(
  "/api/profiles/onboarding",
  rateLimit({ windowMs: 60_000, max: 10, keyPrefix: "onboarding" })
);
app.use("/api/account", rateLimit({ windowMs: 3_600_000, max: 5, keyPrefix: "account" }));

app.use("/api/*", authMiddleware);

// Mount Routes
app.route("/api/profiles", profilesApp);
app.route("/api/marketplace", marketplaceApp);
app.route("/api/lostfound", lostFoundApp);
app.route("/api/social", socialApp);
app.route("/api/food", foodApp); // Read-only
app.route("/api/accommodation", accommodationApp);
app.route("/api/dashboard", dashboardApp);
app.route("/api/role-requests", roleRequestsApp);
app.route("/api/study", studyApp);
app.route("/api/communities", communitiesApp);
app.route("/api/account", accountApp);

app.onError((err, c) => {
  console.error("[api] Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
