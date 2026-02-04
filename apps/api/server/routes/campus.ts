import { Hono } from "hono";
import { db } from "../db";
import { announcements, lostFound, socialPosts } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const campusApp = new Hono();

// --- Announcements ---
campusApp.get("/announcements", async (c) => {
  const university = c.req.query("university");
  if (!university) return c.json({ error: "University required" }, 400);

  const results = await db.select().from(announcements)
    .where(eq(announcements.universityName, university))
    .orderBy(desc(announcements.createdAt));
  return c.json(results);
});

campusApp.post("/announcements", async (c) => {
    const body = await c.req.json();
    const result = await db.insert(announcements).values(body).returning();
    return c.json(result[0], 201);
});

// --- Lost & Found ---
campusApp.get("/lost-found", async (c) => {
  const university = c.req.query("university");
  if (!university) return c.json({ error: "University required" }, 400);

  const results = await db.select().from(lostFound)
    .where(eq(lostFound.universityName, university))
    .orderBy(desc(lostFound.createdAt));
  return c.json(results);
});

campusApp.post("/lost-found", async (c) => {
    const body = await c.req.json();
    const result = await db.insert(lostFound).values(body).returning();
    return c.json(result[0], 201);
});

// --- Social Posts ---
campusApp.get("/feed", async (c) => {
    const university = c.req.query("university");
    if (!university) return c.json({ error: "University required" }, 400);
  
    const results = await db.select().from(socialPosts)
      .where(eq(socialPosts.universityName, university))
      .orderBy(desc(socialPosts.createdAt));
    return c.json(results);
});

campusApp.post("/feed", async (c) => {
    const body = await c.req.json();
    const result = await db.insert(socialPosts).values(body).returning();
    return c.json(result[0], 201);
});

export default campusApp;
