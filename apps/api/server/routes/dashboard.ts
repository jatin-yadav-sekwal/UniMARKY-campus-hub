import { Hono } from "hono";
import { db } from "../db";
import { marketplaceItems, announcements, socialPosts } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const dashboardApp = new Hono<Env>();

// GET /summary - Dashboard Snapshot
dashboardApp.get("/summary", async (c) => {
  const university = c.get("universityName");

  if (!university) {
      return c.json({ error: "Context required" }, 400);
  }

  // Parallel fetching for dashboard speed
  const [latestMarketplace, latestAnnouncements, latestSocial] = await Promise.all([
      db.select().from(marketplaceItems)
        .where(eq(marketplaceItems.universityName, university))
        .orderBy(desc(marketplaceItems.createdAt))
        .limit(3),
      
      db.select().from(announcements)
        .where(eq(announcements.universityName, university))
        .orderBy(desc(announcements.createdAt))
        .limit(2),
        
      db.select().from(socialPosts)
        .where(eq(socialPosts.universityName, university))
        .orderBy(desc(socialPosts.createdAt))
        .limit(2)
  ]);

  return c.json({
      marketplace: latestMarketplace,
      announcements: latestAnnouncements,
      social: latestSocial,
  });
});

export default dashboardApp;
