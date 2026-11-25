import { Hono } from "hono";
import type { Context } from "hono";
import { db } from "../db";
import { socialPosts, postLikes, comments } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";
import { getPagination } from "../utils/pagination";

/**
 * Unimedia is retired. This router is a READ-ONLY archive: old posts, likes
 * and comments stay visible to the university they belong to, but every write
 * returns 410 Gone. New social features live in Communities/Notices/News.
 *
 * NOTE: author/user objects deliberately exclude `idCardUrl` — it was leaked
 * as an "avatar" in the previous implementation.
 */

const socialApp = new Hono<Env>();

const GONE = { error: "Unimedia posting has been retired. Use Communities, Notices or News." } as const;

function gone(c: Context<Env>) {
  return c.json(GONE, 410);
}

const POST_TYPES = ["post", "event", "announcement"] as const;

// ==========================================
// POST ROUTES (read-only)
// ==========================================

// GET / — List Posts
socialApp.get("/", async (c) => {
  const rawType = c.req.query("type") as (typeof POST_TYPES)[number] | null;
  const type = rawType && POST_TYPES.includes(rawType) ? rawType : null;
  const { limit, offset } = getPagination(c);
  const university = c.get("universityName");
  const userId = c.get("userId");

  if (!university) return c.json({ items: [], hasMore: false });

  const whereClause = type === null
    ? eq(socialPosts.universityName, university)
    : and(
        eq(socialPosts.universityName, university),
        eq(socialPosts.type, type)
      );

  const results = await db.query.socialPosts.findMany({
    where: whereClause,
    orderBy: desc(socialPosts.createdAt),
    limit,
    offset,
    with: {
      author: {
        columns: {
          id: true,
          fullName: true,
          role: true,
        },
      },
      likes: {
        where: eq(postLikes.userId, userId),
        columns: { userId: true },
      },
    },
  });

  const posts = results.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined,
  }));

  return c.json({ items: posts, hasMore: posts.length === limit });
});

// GET /my-posts — Current user's posts
socialApp.get("/my-posts", async (c) => {
  const { limit, offset } = getPagination(c);
  const userId = c.get("userId");

  if (!userId) return c.json({ items: [], hasMore: false });

  const results = await db.query.socialPosts.findMany({
    where: eq(socialPosts.authorId, userId),
    orderBy: desc(socialPosts.createdAt),
    limit,
    offset,
    with: {
      author: {
        columns: { id: true, fullName: true, role: true },
      },
      likes: {
        where: eq(postLikes.userId, userId),
        columns: { userId: true },
      },
    },
  });

  const posts = results.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined,
  }));

  return c.json({ items: posts, hasMore: posts.length === limit });
});

// GET /:id — Single Post
socialApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const university = c.get("universityName");

  const post = await db.query.socialPosts.findFirst({
    where: university
      ? and(eq(socialPosts.id, id), eq(socialPosts.universityName, university))
      : eq(socialPosts.id, id),
    with: {
      author: {
        columns: { id: true, fullName: true, role: true },
      },
      likes: {
        where: eq(postLikes.userId, userId),
        columns: { userId: true },
      },
    },
  });

  if (!post) return c.json({ error: "Post not found" }, 404);

  return c.json({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined,
  });
});

// ==========================================
// COMMENT ROUTES (read-only)
// ==========================================

// GET /:id/comments — List Comments (paginated)
socialApp.get("/:id/comments", async (c) => {
  const postId = c.req.param("id");
  const { limit, offset } = getPagination(c, 5);

  const result = await db.query.comments.findMany({
    where: eq(comments.postId, postId),
    orderBy: desc(comments.createdAt),
    limit,
    offset,
    with: {
      user: {
        columns: { id: true, fullName: true, role: true },
      },
    },
  });

  return c.json({ items: result, hasMore: result.length === limit });
});

// ==========================================
// WRITES ARE RETIRED
// ==========================================

// POST / — Create Post
socialApp.post("/", (c) => gone(c));

// POST /:id/like — Toggle Like
socialApp.post("/:id/like", (c) => gone(c));

// DELETE /:id — Delete Post
socialApp.delete("/:id", (c) => gone(c));

// POST /:id/comments — Add Comment
socialApp.post("/:id/comments", (c) => gone(c));

// DELETE /comments/:commentId — Delete Comment
socialApp.delete("/comments/:commentId", (c) => gone(c));

export default socialApp;
