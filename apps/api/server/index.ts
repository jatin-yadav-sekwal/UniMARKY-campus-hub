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
import roleRequestsApp from "./routes/roleRequests";
import studyApp from "./routes/study";

const app = new Hono<Env>();

// Global Middleware
app.use("*", logger());
app.use("*", cors({
  origin: (origin) => {
    const allowedOrigins = [ 
      "https://unimarky-campus-hub-web.vercel.app", // Hardcoded prod URL as fallback
      process.env.VITE_DEV_SERVER_URL,
      process.env.VITE_WEB_URL,
      process.env.CORS_ORIGIN
    ].filter((url): url is string => !!url); // Type guard to filter null/undefined
    
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return allowedOrigins[0] || "*";

    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    
    // Optional: Log blocked origins for debugging (remove in strict production if needed)
    console.log(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    
    return allowedOrigins[0]; 
  },
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));
app.use("/api/*", authMiddleware);

// Health Check
app.get("/", (c) => c.text("Unmarky API is running!"));

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

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
