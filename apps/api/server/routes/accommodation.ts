import { Hono } from "hono";
import { db } from "../db";
import { accommodationListings } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";
import { requireRole } from "../middleware/roleGuard";

const accommodationApp = new Hono<Env>();

// GET / - List Accommodations with Pagination and Type Filter
accommodationApp.get("/", async (c) => {
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const type = c.req.query("type");
  
  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  const conditions = [eq(accommodationListings.universityName, university)];
  if (type && type !== "all") {
    conditions.push(eq(accommodationListings.type, type as "PG" | "Hostel" | "Apartment"));
  }

  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(accommodationListings)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  const items = await db.select().from(accommodationListings)
    .where(and(...conditions))
    .orderBy(desc(accommodationListings.rating))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;
    
  return c.json({ items, hasMore, total });
});

// GET /my-listings - Superuser's own accommodations
accommodationApp.get("/my-listings", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");
  
  const items = await db.select().from(accommodationListings)
    .where(eq(accommodationListings.ownerId, userId))
    .orderBy(desc(accommodationListings.createdAt));
    
  return c.json(items);
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

// ===== SUPERUSER CRUD ROUTES =====

// POST / - Create Accommodation (superuser only)
accommodationApp.post("/", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");
  const university = c.get("universityName");
  const body = await c.req.json();
  
  const newAccommodation = await db.insert(accommodationListings).values({
    ownerId: userId,
    name: body.name,
    type: body.type,
    description: body.description || null,
    address: body.address || null,
    phone: body.phone || null,
    amenities: body.amenities || null,
    images: body.images ? JSON.stringify(body.images) : null,
    minPrice: body.minPrice || null,
    maxPrice: body.maxPrice || null,
    rentRange: body.rentRange || null,
    location: body.location,
    contact: body.contact || null,
    universityName: university,
  }).returning();
  
  return c.json(newAccommodation[0], 201);
});

// PATCH /:id - Update Accommodation (superuser, must own)
accommodationApp.patch("/:id", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json();
  
  const existing = await db.select().from(accommodationListings).where(eq(accommodationListings.id, id));
  if (existing.length === 0) return c.json({ error: "Accommodation not found" }, 404);
  if (existing[0].ownerId !== userId) {
    const role = c.get("userRole");
    if (role !== "userX") {
      return c.json({ error: "You can only edit your own accommodations" }, 403);
    }
  }
  
  const allowedFields: Record<string, any> = {};
  const fields = ["name", "type", "description", "address", "phone", "amenities", "minPrice", "maxPrice", "rentRange", "location", "contact"];
  for (const f of fields) {
    if (body[f] !== undefined) allowedFields[f] = body[f];
  }
  if (body.images !== undefined) {
    allowedFields.images = JSON.stringify(body.images);
  }
  
  if (Object.keys(allowedFields).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }
  
  const updated = await db.update(accommodationListings).set(allowedFields).where(eq(accommodationListings.id, id)).returning();
  return c.json(updated[0]);
});

// DELETE /:id - Delete Accommodation (superuser, must own)
accommodationApp.delete("/:id", requireRole("superuser", "userX"), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  
  const existing = await db.select().from(accommodationListings).where(eq(accommodationListings.id, id));
  if (existing.length === 0) return c.json({ error: "Accommodation not found" }, 404);
  if (existing[0].ownerId !== userId) {
    const role = c.get("userRole");
    if (role !== "userX") {
      return c.json({ error: "You can only delete your own accommodations" }, 403);
    }
  }
  
  await db.delete(accommodationListings).where(eq(accommodationListings.id, id));
  return c.json({ success: true });
});

export default accommodationApp;
