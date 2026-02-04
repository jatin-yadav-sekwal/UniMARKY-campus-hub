import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { socialPosts } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const socialApp = new Hono<Env>();

const createPostSchema = z.object({
  content: z.string().min(1),
  // Image URL support if needed later, user asked for text/image
});

// GET / - Feed
socialApp.get("/", async (c) => {
  const university = c.get("universityName");
  
  if (!university) return c.json([]);

  const results = await db.select().from(socialPosts)
    .where(eq(socialPosts.universityName, university))
    .orderBy(desc(socialPosts.createdAt));
    
  return c.json(results);
});

// POST / - Create Post
socialApp.post("/", zValidator("json", createPostSchema), async (c) => {
  const body = c.req.valid("json");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId || !university) {
      return c.json({ error: "Unauthorized" }, 401);
  }

  const newPost = await db.insert(socialPosts).values({
      ...body,
      authorId: userId,
      universityName: university,
  }).returning();

  return c.json(newPost[0], 201);
});

export default socialApp;
