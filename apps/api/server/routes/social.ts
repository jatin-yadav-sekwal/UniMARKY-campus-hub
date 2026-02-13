import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { socialPosts, postLikes, comments, profiles } from "../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import type { Env } from "../middleware/auth";

const socialApp = new Hono<Env>();

// --- Schemas ---

const createPostSchema = z.object({
    content: z.string().min(1, "Content is required"),
    type: z.enum(["post", "event", "announcement"]).default("post"),
    title: z.string().optional(),
    imageUrl: z.string().optional(),
    eventDate: z.string().optional(),   // ISO date string for events
    hostedBy: z.string().optional(),    // who hosts the event
});

const paginationSchema = z.object({
    limit: z.coerce.number().optional().default(10),
    offset: z.coerce.number().optional().default(0),
    type: z.enum(["all", "post", "event", "announcement"]).optional().default("all"),
});

const createCommentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long (max 500 chars)"),
});

const commentPaginationSchema = z.object({
    limit: z.coerce.number().optional().default(5),
    offset: z.coerce.number().optional().default(0),
});

// ==========================================
// POST ROUTES
// ==========================================

// GET / — List Posts
socialApp.get("/", zValidator("query", paginationSchema), async (c) => {
    const { limit, offset, type } = c.req.valid("query");
    const university = c.get("universityName");
    const userId = c.get("userId");

    if (!university) return c.json({ items: [], hasMore: false });

    const whereClause = type === "all"
        ? eq(socialPosts.universityName, university)
        : and(
            eq(socialPosts.universityName, university),
            eq(socialPosts.type, type as "post" | "event" | "announcement")
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
                    idCardUrl: true,
                    role: true,
                }
            },
            likes: {
                where: eq(postLikes.userId, userId),
                columns: { userId: true }
            }
        }
    });

    const posts = results.map(post => ({
        ...post,
        isLiked: post.likes.length > 0,
        likes: undefined,
    }));

    return c.json({ items: posts, hasMore: posts.length === limit });
});

// GET /my-posts — Current user's posts
socialApp.get("/my-posts", zValidator("query", z.object({
    limit: z.coerce.number().optional().default(10),
    offset: z.coerce.number().optional().default(0),
})), async (c) => {
    const { limit, offset } = c.req.valid("query");
    const userId = c.get("userId");

    if (!userId) return c.json({ items: [], hasMore: false });

    const results = await db.query.socialPosts.findMany({
        where: eq(socialPosts.authorId, userId),
        orderBy: desc(socialPosts.createdAt),
        limit,
        offset,
        with: {
            author: {
                columns: { id: true, fullName: true, idCardUrl: true, role: true }
            },
            likes: {
                where: eq(postLikes.userId, userId),
                columns: { userId: true }
            }
        }
    });

    const posts = results.map(post => ({
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

    const post = await db.query.socialPosts.findFirst({
        where: eq(socialPosts.id, id),
        with: {
            author: {
                columns: { id: true, fullName: true, idCardUrl: true, role: true }
            },
            likes: {
                where: eq(postLikes.userId, userId),
                columns: { userId: true }
            }
        }
    });

    if (!post) return c.json({ error: "Post not found" }, 404);

    return c.json({
        ...post,
        isLiked: post.likes.length > 0,
        likes: undefined,
    });
});

// POST / — Create Post
// Anyone can post regular posts; only superuser/userX can post events/announcements
socialApp.post("/", zValidator("json", createPostSchema), async (c) => {
    const body = c.req.valid("json");
    const userId = c.get("userId");
    const userRole = c.get("userRole");
    const university = c.get("universityName");

    if (!userId || !university) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Only superuser and userX can create events or announcements
    if ((body.type === "event" || body.type === "announcement") &&
        userRole !== "superuser" && userRole !== "userX") {
        return c.json({ error: "Only superusers and admins can post events or announcements" }, 403);
    }

    const [newPost] = await db.insert(socialPosts).values({
        content: body.content,
        type: body.type,
        title: body.title,
        imageUrl: body.imageUrl,
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        hostedBy: body.hostedBy,
        authorId: userId,
        universityName: university,
    }).returning();

    return c.json(newPost, 201);
});

// POST /:id/like — Toggle Like
socialApp.post("/:id/like", async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");

    const existingLike = await db.query.postLikes.findFirst({
        where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
    });

    if (existingLike) {
        await db.delete(postLikes).where(eq(postLikes.id, existingLike.id));
        await db.update(socialPosts)
            .set({ likesCount: sql`GREATEST(${socialPosts.likesCount} - 1, 0)` })
            .where(eq(socialPosts.id, postId));
        return c.json({ liked: false });
    } else {
        await db.insert(postLikes).values({ postId, userId });
        await db.update(socialPosts)
            .set({ likesCount: sql`${socialPosts.likesCount} + 1` })
            .where(eq(socialPosts.id, postId));
        return c.json({ liked: true });
    }
});

// DELETE /:id — Delete Post
socialApp.delete("/:id", async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");
    const userRole = c.get("userRole");

    const post = await db.query.socialPosts.findFirst({
        where: eq(socialPosts.id, postId),
    });

    if (!post) return c.json({ error: "Post not found" }, 404);

    if (post.authorId !== userId && userRole !== "admin" && userRole !== "superuser") {
        return c.json({ error: "Unauthorized" }, 403);
    }

    await db.delete(socialPosts).where(eq(socialPosts.id, postId));
    return c.json({ success: true });
});

// ==========================================
// COMMENT ROUTES
// ==========================================

// GET /:id/comments — List Comments (paginated, default 5)
socialApp.get("/:id/comments", zValidator("query", commentPaginationSchema), async (c) => {
    const postId = c.req.param("id");
    const { limit, offset } = c.req.valid("query");

    const result = await db.query.comments.findMany({
        where: eq(comments.postId, postId),
        orderBy: desc(comments.createdAt),
        limit,
        offset,
        with: {
            user: {
                columns: { id: true, fullName: true, idCardUrl: true, role: true }
            }
        }
    });

    return c.json({ items: result, hasMore: result.length === limit });
});

// POST /:id/comments — Add Comment
socialApp.post("/:id/comments", zValidator("json", createCommentSchema), async (c) => {
    const postId = c.req.param("id");
    const userId = c.get("userId");
    const { content } = c.req.valid("json");

    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const post = await db.query.socialPosts.findFirst({
        where: eq(socialPosts.id, postId),
        columns: { id: true }
    });

    if (!post) return c.json({ error: "Post not found" }, 404);

    const [newComment] = await db.insert(comments).values({ postId, userId, content }).returning();

    await db.update(socialPosts)
        .set({ commentsCount: sql`${socialPosts.commentsCount} + 1` })
        .where(eq(socialPosts.id, postId));

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId),
        columns: { id: true, fullName: true, idCardUrl: true, role: true }
    });

    return c.json({ ...newComment, user: profile }, 201);
});

// DELETE /comments/:commentId — Delete Comment
socialApp.delete("/comments/:commentId", async (c) => {
    const commentId = c.req.param("commentId");
    const userId = c.get("userId");
    const userRole = c.get("userRole");

    const comment = await db.query.comments.findFirst({
        where: eq(comments.id, commentId),
    });

    if (!comment) return c.json({ error: "Comment not found" }, 404);

    if (comment.userId !== userId && userRole !== "admin" && userRole !== "superuser") {
        return c.json({ error: "Unauthorized" }, 403);
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    await db.update(socialPosts)
        .set({ commentsCount: sql`GREATEST(${socialPosts.commentsCount} - 1, 0)` })
        .where(eq(socialPosts.id, comment.postId));

    return c.json({ success: true });
});

export default socialApp;
