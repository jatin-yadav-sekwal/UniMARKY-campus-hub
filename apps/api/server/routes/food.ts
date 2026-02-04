import { Hono } from "hono";
import { db } from "../db";
import { foodListings, menuItems } from "../db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const foodApp = new Hono<Env>();

// GET / - List Restaurants with Pagination
foodApp.get("/", async (c) => {
  const university = c.get("universityName");
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const cuisine = c.req.query("cuisine");
  
  if (!university) {
    return c.json({ items: [], hasMore: false, total: 0 });
  }

  // Build conditions
  const conditions = [eq(foodListings.universityName, university)];
  if (cuisine && cuisine !== "all") {
    conditions.push(eq(foodListings.cuisine, cuisine));
  }

  // Get total count
  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(foodListings)
    .where(and(...conditions));
  const total = Number(countResult[0]?.count || 0);

  // Get paginated items
  const items = await db.select().from(foodListings)
    .where(and(...conditions))
    .orderBy(desc(foodListings.rating))
    .limit(limit)
    .offset(offset);

  const hasMore = offset + items.length < total;
    
  return c.json({ items, hasMore, total });
});

// GET /:id - Restaurant Detail
foodApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  
  const restaurant = await db.select().from(foodListings)
    .where(eq(foodListings.id, id));
  
  if (restaurant.length === 0) {
    return c.json({ error: "Restaurant not found" }, 404);
  }

  // Get menu items grouped by category
  const menu = await db.select().from(menuItems)
    .where(eq(menuItems.restaurantId, id))
    .orderBy(menuItems.category, desc(menuItems.rating));
    
  return c.json({
    ...restaurant[0],
    menu
  });
});

// GET /:id/menu - Just Menu Items
foodApp.get("/:id/menu", async (c) => {
  const id = c.req.param("id");
  const category = c.req.query("category");
  
  const conditions = [eq(menuItems.restaurantId, id)];
  if (category && category !== "all") {
    conditions.push(eq(menuItems.category, category));
  }
  
  const items = await db.select().from(menuItems)
    .where(and(...conditions))
    .orderBy(desc(menuItems.rating));
    
  return c.json(items);
});

// GET /menu-item/:id - Single Menu Item Detail
foodApp.get("/menu-item/:id", async (c) => {
  const id = c.req.param("id");
  
  const result = await db.select({
    item: menuItems,
    restaurant: {
      id: foodListings.id,
      name: foodListings.name,
      location: foodListings.location,
    }
  })
  .from(menuItems)
  .leftJoin(foodListings, eq(menuItems.restaurantId, foodListings.id))
  .where(eq(menuItems.id, id));
  
  const firstResult = result[0];
  if (!firstResult || !firstResult.item) {
    return c.json({ error: "Menu item not found" }, 404);
  }
  
  return c.json({
    ...firstResult.item,
    restaurant: firstResult.restaurant ?? null
  });
});

export default foodApp;
