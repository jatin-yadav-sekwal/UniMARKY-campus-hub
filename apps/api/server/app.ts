import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth";
import type { Env } from "./middleware/auth";
import { initDb } from "./db";

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

// Add Bindings type for Cloudflare Workers
type Bindings = {
  DATABASE_URL: string;
  VITE_DEV_SERVER_URL?: string;
  VITE_WEB_URL?: string;
  CORS_ORIGIN?: string;
  PORT?: string;
};

// Merge Bindings into Env
type AppEnv = Env & { Bindings: Bindings };

const app = new Hono<AppEnv>();

// Global Middleware
app.use("*", logger());

// Initialize DB from Env
app.use("*", async (c, next) => {
  if (c.env.DATABASE_URL) {
    initDb(c.env.DATABASE_URL);
  }
  await next();
});

app.use("*", cors({
  origin: (origin, c) => {
    // Access env from context if available, fallback to process.env (for local node)
    const env = c.env || (typeof process !== 'undefined' ? process.env : {});
    
    const allowedOrigins = [ 
      "https://unimarky-campus-hub-web.vercel.app", // Hardcoded prod URL as fallback
      env.VITE_DEV_SERVER_URL,
      env.VITE_WEB_URL,
      env.CORS_ORIGIN
      
    ].filter((url): url is string => !!url); // Type guard to filter null/undefined
    
    // Allow requests with no origin (e.g. mobile apps, curl)
    if (!origin) return allowedOrigins[0] || "*";

    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    
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

export default app;
