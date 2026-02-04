import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { marketplaceItems, profiles } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const marketplaceApp = new Hono<Env>();

// Schema for creating an item
const createItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.string().or(z.number()).transform((val) => String(val)),
  category: z.string().optional(),
  condition: z.string().optional(),
  manufacturedYear: z.string().optional(),
  isNegotiable: z.boolean().optional().default(false),
  imageUrl: z.string().optional(),
});

// GET / - Context-Aware Fetch with Pagination
marketplaceApp.get("/", async (c) => {
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const category = c.req.query("category");
  
  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  // Build where conditions
  const conditions = [eq(marketplaceItems.universityName, university)];
  if (category && category !== "all") {
    conditions.push(eq(marketplaceItems.category, category));
  }

  // Get total count
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(marketplaceItems)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  // Get paginated items
  const items = await db.select().from(marketplaceItems)
    .where(and(...conditions))
    .orderBy(desc(marketplaceItems.createdAt))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;
    
  return c.json({ items, hasMore, total });
});

// POST / - Create Item
marketplaceApp.post("/", zValidator("json", createItemSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId || !university) {
    return c.json({ error: "Unauthorized or missing profile context" }, 401);
  }

  const newItem = await db.insert(marketplaceItems).values({
    ...body,
    sellerId: userId,
    universityName: university,
    price: body.price,
  }).returning();

  return c.json(newItem[0], 201);
});

// GET /:id - Item Details with Seller Info
marketplaceApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  
  // Get item with seller details
  const result = await db.select({
    item: marketplaceItems,
    seller: {
      id: profiles.id,
      fullName: profiles.fullName,
      mobileNumber: profiles.mobileNumber,
      department: profiles.department,
      isVerified: profiles.isVerified,
    }
  })
  .from(marketplaceItems)
  .leftJoin(profiles, eq(marketplaceItems.sellerId, profiles.id))
  .where(eq(marketplaceItems.id, id));
  
  if (result.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }
  
  return c.json({
    ...result[0].item,
    seller: result[0].seller
  });
});

export default marketplaceApp;
