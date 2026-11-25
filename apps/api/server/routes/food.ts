import { Hono } from "hono";
import { db } from "../db";
import { foodListings, menuItems } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";
import { requirePermission } from "../middleware/permission";
import { canModify } from "../middleware/policies";
import { getPagination } from "../utils/pagination";

const foodApp = new Hono<Env>();

// GET / - List Restaurants with Pagination (all students can read)
foodApp.get("/", async (c) => {
  const university = c.get("universityName");
  const { limit, offset } = getPagination(c);
  const cuisine = c.req.query("cuisine");

  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  const conditions = [eq(foodListings.universityName, university)];
  if (cuisine && cuisine !== "all") {
    conditions.push(eq(foodListings.cuisine, cuisine));
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(foodListings)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  const items = await db
    .select()
    .from(foodListings)
    .where(and(...conditions))
    .orderBy(desc(foodListings.rating))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;

  return c.json({ items, hasMore, total });
});

// GET /my-listings - Publisher's own restaurants
foodApp.get("/my-listings", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");

  const items = await db
    .select()
    .from(foodListings)
    .where(eq(foodListings.ownerId, userId))
    .orderBy(desc(foodListings.createdAt));

  return c.json(items);
});

// GET /:id - Restaurant Detail (tenant-scoped)
foodApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");

  if (!university) {
    return c.json({ error: "Restaurant not found" }, 404);
  }

  const restaurant = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.universityName, university)));

  if (restaurant.length === 0) {
    return c.json({ error: "Restaurant not found" }, 404);
  }

  const menu = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, id))
    .orderBy(menuItems.category, desc(menuItems.rating));

  return c.json({
    ...restaurant[0],
    menu,
  });
});

// GET /:id/menu - Just Menu Items (tenant-scoped)
foodApp.get("/:id/menu", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");
  const category = c.req.query("category");

  if (!university) {
    return c.json([]);
  }

  const restaurant = await db
    .select({ id: foodListings.id })
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.universityName, university)))
    .limit(1);

  if (restaurant.length === 0) {
    return c.json({ error: "Restaurant not found" }, 404);
  }

  const conditions = [eq(menuItems.restaurantId, id)];
  if (category && category !== "all") {
    conditions.push(eq(menuItems.category, category));
  }

  const items = await db
    .select()
    .from(menuItems)
    .where(and(...conditions))
    .orderBy(desc(menuItems.rating));

  return c.json(items);
});

// GET /menu-item/:id - Single Menu Item Detail (tenant-scoped)
foodApp.get("/menu-item/:id", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");

  if (!university) {
    return c.json({ error: "Menu item not found" }, 404);
  }

  const result = await db
    .select({
      item: menuItems,
      restaurant: {
        id: foodListings.id,
        name: foodListings.name,
        location: foodListings.location,
      },
    })
    .from(menuItems)
    .leftJoin(foodListings, eq(menuItems.restaurantId, foodListings.id))
    .where(and(eq(menuItems.id, id), eq(foodListings.universityName, university)));

  const firstResult = result[0];
  if (!firstResult || !firstResult.item) {
    return c.json({ error: "Menu item not found" }, 404);
  }

  return c.json({
    ...firstResult.item,
    restaurant: firstResult.restaurant ?? null,
  });
});

// ===== PUBLISHER CRUD ROUTES =====

// POST / - Create Restaurant (publishers with food.manage)
foodApp.post("/", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const university = c.get("universityName");
  const body = await c.req.json();

  const newRestaurant = await db
    .insert(foodListings)
    .values({
      ownerId: userId,
      name: body.name,
      description: body.description || null,
      cuisine: body.cuisine || null,
      tags: body.tags || null,
      address: body.address || null,
      phone: body.phone || null,
      timing: body.timing || null,
      priceRange: body.priceRange || null,
      imageUrl: body.imageUrl || null,
      location: body.location,
      universityName: university,
    })
    .returning();

  return c.json(newRestaurant[0], 201);
});

// PATCH /:id - Update Restaurant (owner or admin, same university)
foodApp.patch("/:id", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");
  const id = c.req.param("id");
  const body = await c.req.json();

  const existing = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.universityName, university)))
    .limit(1);
  if (existing.length === 0) return c.json({ error: "Restaurant not found" }, 404);

  if (!canModify(role, userId, existing[0].ownerId)) {
    return c.json({ error: "You can only edit your own restaurants" }, 403);
  }

  const allowedFields: Record<string, any> = {};
  const fields = ["name", "description", "cuisine", "tags", "address", "phone", "timing", "priceRange", "imageUrl", "location"];
  for (const f of fields) {
    if (body[f] !== undefined) allowedFields[f] = body[f];
  }

  if (Object.keys(allowedFields).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  const updated = await db
    .update(foodListings)
    .set(allowedFields)
    .where(eq(foodListings.id, id))
    .returning();
  return c.json(updated[0]);
});

// DELETE /:id - Delete Restaurant (owner or admin, same university)
foodApp.delete("/:id", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");
  const id = c.req.param("id");

  const existing = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, id), eq(foodListings.universityName, university)))
    .limit(1);
  if (existing.length === 0) return c.json({ error: "Restaurant not found" }, 404);

  if (!canModify(role, userId, existing[0].ownerId)) {
    return c.json({ error: "You can only delete your own restaurants" }, 403);
  }

  await db.delete(foodListings).where(eq(foodListings.id, id));
  return c.json({ success: true });
});

// POST /:id/menu - Add Menu Item (owner or admin, same university)
foodApp.post("/:id/menu", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");
  const restaurantId = c.req.param("id");
  const body = await c.req.json();

  const restaurant = await db
    .select()
    .from(foodListings)
    .where(and(eq(foodListings.id, restaurantId), eq(foodListings.universityName, university)))
    .limit(1);
  if (restaurant.length === 0) return c.json({ error: "Restaurant not found" }, 404);

  if (!canModify(role, userId, restaurant[0].ownerId)) {
    return c.json({ error: "You can only add menu items to your own restaurants" }, 403);
  }

  const newItem = await db
    .insert(menuItems)
    .values({
      restaurantId,
      name: body.name,
      description: body.description || null,
      price: body.price,
      category: body.category || null,
      imageUrl: body.imageUrl || null,
      isVeg: body.isVeg ?? true,
      isAvailable: body.isAvailable ?? true,
    })
    .returning();

  return c.json(newItem[0], 201);
});

// PATCH /menu/:id - Update Menu Item (owner or admin, same university)
foodApp.patch("/menu/:id", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");
  const menuItemId = c.req.param("id");
  const body = await c.req.json();

  const rows = await db
    .select({ item: menuItems, ownerId: foodListings.ownerId })
    .from(menuItems)
    .innerJoin(foodListings, eq(menuItems.restaurantId, foodListings.id))
    .where(and(eq(menuItems.id, menuItemId), eq(foodListings.universityName, university)))
    .limit(1);
  if (rows.length === 0) return c.json({ error: "Menu item not found" }, 404);

  if (!canModify(role, userId, rows[0].ownerId)) {
    return c.json({ error: "You can only edit menu items of your own restaurants" }, 403);
  }

  const allowedFields: Record<string, any> = {};
  const fields = ["name", "description", "price", "category", "imageUrl", "isVeg", "isAvailable"];
  for (const f of fields) {
    if (body[f] !== undefined) allowedFields[f] = body[f];
  }

  const updated = await db
    .update(menuItems)
    .set(allowedFields)
    .where(eq(menuItems.id, menuItemId))
    .returning();
  return c.json(updated[0]);
});

// DELETE /menu/:id - Delete Menu Item (owner or admin, same university)
foodApp.delete("/menu/:id", requirePermission("food.manage"), async (c) => {
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");
  const menuItemId = c.req.param("id");

  const rows = await db
    .select({ item: menuItems, ownerId: foodListings.ownerId })
    .from(menuItems)
    .innerJoin(foodListings, eq(menuItems.restaurantId, foodListings.id))
    .where(and(eq(menuItems.id, menuItemId), eq(foodListings.universityName, university)))
    .limit(1);
  if (rows.length === 0) return c.json({ error: "Menu item not found" }, 404);

  if (!canModify(role, userId, rows[0].ownerId)) {
    return c.json({ error: "You can only delete menu items of your own restaurants" }, 403);
  }

  await db.delete(menuItems).where(eq(menuItems.id, menuItemId));
  return c.json({ success: true });
});

export default foodApp;
