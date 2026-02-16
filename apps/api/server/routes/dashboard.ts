import { Hono } from "hono";
import { db } from "../db";
import { marketplaceItems, announcements, lostFound } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const dashboardApp = new Hono<Env>();

// GET /summary - Dashboard Snapshot
dashboardApp.get("/summary", async (c) => {
  const university = c.get("universityName");
  const userId = c.get("userId");

  if (!university) {
      return c.json({ error: "Context required" }, 400);
  }

  if (!userId) {
      return c.json({ error: "Unauthorized" }, 401);
  }

  // Parallel fetching for dashboard speed - user-specific data
  const [latestMarketplace, latestAnnouncements, latestLostFound] = await Promise.all([
      db.select().from(marketplaceItems)
        .where(and(
          eq(marketplaceItems.universityName, university),
          eq(marketplaceItems.sellerId, userId)
        ))
        .orderBy(desc(marketplaceItems.createdAt))
        .limit(3),
      
      db.select().from(announcements)
        .where(eq(announcements.universityName, university))
        .orderBy(desc(announcements.createdAt))
        .limit(2),
        
      db.select().from(lostFound)
        .where(and(
          eq(lostFound.universityName, university),
          eq(lostFound.reporterId, userId)
        ))
        .orderBy(desc(lostFound.createdAt))
        .limit(3)
  ]);

  return c.json({
      marketplace: latestMarketplace,
      announcements: latestAnnouncements,
      lostFound: latestLostFound,
  });
});

export default dashboardApp;
