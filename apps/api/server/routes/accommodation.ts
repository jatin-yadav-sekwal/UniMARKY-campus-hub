import { Hono } from "hono";
import { db } from "../db";
import { accommodationListings } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const accommodationApp = new Hono<Env>();

// GET / - List Accommodations with Pagination and Type Filter
accommodationApp.get("/", async (c) => {
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const type = c.req.query("type"); // "PG" | "Hostel" | "Apartment"
  
  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  // Build conditions
  const conditions = [eq(accommodationListings.universityName, university)];
  if (type && type !== "all") {
    conditions.push(eq(accommodationListings.type, type as "PG" | "Hostel" | "Apartment"));
  }

  // Get total count
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(accommodationListings)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  // Get paginated items
  const items = await db.select().from(accommodationListings)
    .where(and(...conditions))
    .orderBy(desc(accommodationListings.rating))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;
    
  return c.json({ items, hasMore, total });
});

// GET /:id - Accommodation Detail
accommodationApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  
  const result = await db.select().from(accommodationListings)
    .where(eq(accommodationListings.id, id));
  
  const accommodation = result[0];
  if (!accommodation) {
    return c.json({ error: "Accommodation not found" }, 404);
  }

  // Parse images JSON if stored as string
  let parsedImages: string[] = [];
  if (accommodation.images) {
    try {
      parsedImages = JSON.parse(accommodation.images);
    } catch {
      parsedImages = [];
    }
  }
    
  return c.json({
    ...accommodation,
    images: parsedImages
  });
});

export default accommodationApp;
