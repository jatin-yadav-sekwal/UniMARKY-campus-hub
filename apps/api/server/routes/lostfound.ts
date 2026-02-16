import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { lostFound, profiles } from "../db/schema";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const lostFoundApp = new Hono<Env>();

const createReportSchema = z.object({
  itemName: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["lost", "found"]),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  status: z.string().default("open"),
});

// GET / - Filter by University with Pagination
lostFoundApp.get("/", async (c) => {
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const type = c.req.query("type"); // "lost" | "found" | undefined
  const q = c.req.query("q"); // Search query
  
  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  // Build where conditions
  const conditions = [eq(lostFound.universityName, university)];
  if (type && (type === "lost" || type === "found")) {
    conditions.push(eq(lostFound.type, type));
  }
  if (q) {
    // @ts-ignore
    conditions.push(or(ilike(lostFound.itemName, `%${q}%`), ilike(lostFound.description!, `%${q}%`)));
  }

  // Get total count
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(lostFound)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  // Get paginated items with reporter name
  const items = await db.select({
    item: lostFound,
    reporter: {
      fullName: profiles.fullName,
    }
  })
  .from(lostFound)
  .leftJoin(profiles, eq(lostFound.reporterId, profiles.id))
  .where(and(...conditions))
  .orderBy(desc(lostFound.createdAt))
  .limit(limit)
  .offset(offset);

  const hasMore = offset + items.length < total;
  
  // Flatten the response
  const flatItems = items.map(({ item, reporter }) => ({
    ...item,
    reporterName: reporter?.fullName || "Anonymous"
  }));
    
  return c.json({ items: flatItems, hasMore, total });
});

// POST / - Report Item
lostFoundApp.post("/", zValidator("json", createReportSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId || !university) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const newItem = await db.insert(lostFound).values({
    ...body,
    reporterId: userId,
    universityName: university,
  }).returning();

  return c.json(newItem[0], 201);
});

// GET /my-listings - Current user's listings
lostFoundApp.get("/my-listings", async (c) => {
  const userId = c.get("userId");
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  if (!userId || !university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  // Build where conditions
  const conditions = [
    eq(lostFound.universityName, university),
    eq(lostFound.reporterId, userId)
  ];

  // Get total count
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(lostFound)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  // Get paginated items
  const items = await db.select().from(lostFound)
    .where(and(...conditions))
    .orderBy(desc(lostFound.createdAt))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;
    
  return c.json({ items, hasMore, total });
});

// GET /:id - Item Details with Reporter Info
lostFoundApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  
  const result = await db.select({
    item: lostFound,
    reporter: {
      id: profiles.id,
      fullName: profiles.fullName,
      mobileNumber: profiles.mobileNumber,
      department: profiles.department,
    }
  })
  .from(lostFound)
  .leftJoin(profiles, eq(lostFound.reporterId, profiles.id))
  .where(eq(lostFound.id, id));
  
  const firstResult = result[0];
  if (!firstResult || !firstResult.item) {
    return c.json({ error: "Item not found" }, 404);
  }
  
  return c.json({
    ...firstResult.item,
    reporter: firstResult.reporter
  });
});

// DELETE /:id - Delete listing
lostFoundApp.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check ownership
  const item = await db.select().from(lostFound)
    .where(eq(lostFound.id, id))
    .limit(1);

  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }

  if (item[0] != undefined && item[0].reporterId !== userId) {
    return c.json({ error: "Forbidden: You can only delete your own listings" }, 403);
  }

  // Delete the item
  await db.delete(lostFound)
    .where(eq(lostFound.id, id));

  return c.json({ message: "Item deleted successfully" });
});

// PATCH /:id - Update listing
lostFoundApp.patch("/:id", zValidator("json", createReportSchema.partial()), async (c) => {
  const id = c.req.param("id");
  const body = c.req.valid("json");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId || !university) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check ownership
  const item = await db.select().from(lostFound)
    .where(eq(lostFound.id, id))
    .limit(1);

  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }

  if (item[0] != undefined &&item[0].reporterId !== userId) {
    return c.json({ error: "Forbidden: You can only edit your own listings" }, 403);
  }

  // Update the item
  const updatedItem = await db.update(lostFound)
    .set({
      ...body,
      updatedAt: new Date(),
    })
    .where(eq(lostFound.id, id))
    .returning();

  return c.json(updatedItem[0]);
});

export default lostFoundApp;
