import { Hono } from "hono";
import { db } from "../db";
import {
  communities,
  communityMembers,
  communityPosts,
  communityComments,
  profiles,
} from "../db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import type { Env } from "../middleware/auth";
import { requirePermission } from "../middleware/permission";
import { isAdmin, hasPermission } from "../middleware/policies";
import { getPagination } from "../utils/pagination";

/**
 * Communities — university-scoped interest groups with a discussion feed.
 * Replaces the retired Unimedia feed.
 *
 * Access model:
 *  - Read: any onboarded user in the same university (tenant-scoped).
 *  - Create: requires the `community.create` capability (admins + superusers;
 *    normal users request it through the role-request flow).
 *  - Post/comment: members of the community (owner/moderator/admin included).
 *  - Moderate (edit/delete community, delete any post/comment): owner,
 *    a moderator of that community, an admin, or `community.manage`.
 *
 * Author objects never expose `mobileNumber` or `idCardUrl`.
 */

const communitiesApp = new Hono<Env>();

const CATEGORIES = [
  "academic",
  "tech",
  "sports",
  "cultural",
  "housing",
  "placement",
  "other",
] as const;

type Category = (typeof CATEGORIES)[number];

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

/** Load a community, scoped to the caller's university. */
async function getCommunity(id: string, university: string | undefined) {
  if (!university) return null;
  const [row] = await db
    .select()
    .from(communities)
    .where(and(eq(communities.id, id), eq(communities.universityName, university)))
    .limit(1);
  return row ?? null;
}

/** The caller's membership row, if any. */
async function getMembership(communityId: string, userId: string | undefined) {
  if (!userId) return null;
  const [row] = await db
    .select()
    .from(communityMembers)
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    )
    .limit(1);
  return row ?? null;
}

/** Owner, moderator-of-this-community, or admin. */
function canModerate(
  role: string | undefined,
  userId: string | undefined,
  community: { createdBy: string | null },
  membershipRole?: string | null
): boolean {
  if (isAdmin(role)) return true;
  if (!userId) return false;
  if (community.createdBy === userId) return true;
  return membershipRole === "moderator";
}

/** Owner, admin, or an explicit `community.manage` grant (management authority). */
async function canManageCommunity(
  role: string | undefined,
  userId: string | undefined,
  university: string | undefined,
  department: string | undefined,
  community: { createdBy: string | null }
): Promise<boolean> {
  if (!userId) return false;
  if (community.createdBy === userId) return true;
  if (isAdmin(role)) return true;
  return hasPermission(role, userId, university, department, "community.manage");
}

// ==========================================
// COLLECTION ROUTES
// ==========================================

// GET / — Browse communities in the caller's university
communitiesApp.get("/", async (c) => {
  const university = c.get("universityName");
  const userId = c.get("userId");
  const { limit, offset } = getPagination(c);
  const q = c.req.query("q")?.trim();
  const category = c.req.query("category");

  if (!university) return c.json({ items: [], hasMore: false, total: 0 });

  const conditions = [
    eq(communities.universityName, university),
    eq(communities.isArchived, false),
  ];
  if (category && isCategory(category)) {
    conditions.push(eq(communities.category, category));
  }
  if (q) {
    conditions.push(
      or(ilike(communities.name, `%${q}%`), ilike(communities.description, `%${q}%`))!
    );
  }

  const countRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(communities)
    .where(and(...conditions));
  const total = Number(countRow[0]?.count || 0);

  const rows = await db
    .select({
      id: communities.id,
      name: communities.name,
      description: communities.description,
      category: communities.category,
      memberCount: communities.memberCount,
      postCount: communities.postCount,
      createdAt: communities.createdAt,
      membershipId: communityMembers.id,
      myRole: communityMembers.role,
    })
    .from(communities)
    .leftJoin(
      communityMembers,
      and(
        eq(communityMembers.communityId, communities.id),
        eq(communityMembers.userId, userId ?? "")
      )
    )
    .where(and(...conditions))
    .orderBy(desc(communities.memberCount), desc(communities.createdAt))
    .limit(limit)
    .offset(offset);

  const items = rows.map(({ membershipId, ...row }) => ({
    ...row,
    isMember: Boolean(membershipId),
  }));

  return c.json({ items, hasMore: offset + items.length < total, total });
});

// GET /mine — Communities the caller belongs to
communitiesApp.get("/mine", async (c) => {
  const userId = c.get("userId");
  const university = c.get("universityName");
  const { limit, offset } = getPagination(c);

  if (!userId || !university) return c.json({ items: [], hasMore: false, total: 0 });

  const conditions = [
    eq(communityMembers.userId, userId),
    eq(communities.universityName, university),
  ];

  const countRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(communityMembers)
    .innerJoin(communities, eq(communityMembers.communityId, communities.id))
    .where(and(...conditions));
  const total = Number(countRow[0]?.count || 0);

  const items = await db
    .select({
      id: communities.id,
      name: communities.name,
      description: communities.description,
      category: communities.category,
      memberCount: communities.memberCount,
      postCount: communities.postCount,
      createdAt: communities.createdAt,
      myRole: communityMembers.role,
      isMember: sql<boolean>`true`,
    })
    .from(communityMembers)
    .innerJoin(communities, eq(communityMembers.communityId, communities.id))
    .where(and(...conditions))
    .orderBy(desc(communityMembers.joinedAt))
    .limit(limit)
    .offset(offset);

  return c.json({ items, hasMore: offset + items.length < total, total });
});

// POST / — Create a community (requires community.create)
communitiesApp.post("/", requirePermission("community.create"), async (c) => {
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId || !university) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON body" }, 400);

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 3 || name.length > 80) {
    return c.json({ error: "Name must be 3–80 characters" }, 400);
  }

  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 1000) : null;
  const category: Category = isCategory(body.category) ? body.category : "other";

  // Enforce a unique name per university.
  const [existing] = await db
    .select({ id: communities.id })
    .from(communities)
    .where(
      and(
        eq(communities.universityName, university),
        sql`lower(${communities.name}) = lower(${name})`
      )
    )
    .limit(1);
  if (existing) {
    return c.json({ error: "A community with that name already exists here" }, 409);
  }

  const [created] = await db
    .insert(communities)
    .values({
      name,
      description,
      category,
      universityName: university,
      createdBy: userId,
      memberCount: 1,
      postCount: 0,
    })
    .returning();

  // The creator starts as a moderator and a member.
  await db
    .insert(communityMembers)
    .values({ communityId: created.id, userId, role: "moderator" })
    .onConflictDoNothing();

  return c.json(created, 201);
});

// ==========================================
// SINGLE-COMMUNITY ROUTES
// ==========================================

// GET /:id — Community detail + caller's membership
communitiesApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");
  const userId = c.get("userId");

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const membership = await getMembership(id, userId);

  const canManage = await canManageCommunity(
    c.get("userRole"),
    userId,
    university,
    c.get("department"),
    community
  );

  return c.json({
    ...community,
    isMember: Boolean(membership),
    myRole: membership?.role ?? null,
    canModerate: canModerate(c.get("userRole"), userId, community, membership?.role),
    canManage,
    canDelete: canManage,
  });
});

// PATCH /:id — Edit community (owner / moderator / admin)
communitiesApp.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const membership = await getMembership(id, userId);
  if (!canModerate(role, userId, community, membership?.role)) {
    return c.json(
      { error: "Forbidden — only the owner, a moderator or an admin can edit" },
      403
    );
  }

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON body" }, 400);

  const allowed: Record<string, any> = {};
  if (typeof body.name === "string") {
    const n = body.name.trim();
    if (n.length < 3 || n.length > 80) {
      return c.json({ error: "Name must be 3–80 characters" }, 400);
    }
    allowed.name = n;
  }
  if (typeof body.description === "string") {
    allowed.description = body.description.trim().slice(0, 1000);
  }
  if (isCategory(body.category)) allowed.category = body.category;
  if (typeof body.isArchived === "boolean") allowed.isArchived = body.isArchived;

  if (Object.keys(allowed).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }
  allowed.updatedAt = new Date();

  const [updated] = await db
    .update(communities)
    .set(allowed)
    .where(eq(communities.id, id))
    .returning();
  return c.json(updated);
});

// DELETE /:id — Delete community (owner / community.manage / admin)
communitiesApp.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const allowed = await canManageCommunity(
    role,
    userId,
    university,
    c.get("department"),
    community
  );
  if (!allowed) return c.json({ error: "Forbidden" }, 403);

  await db.delete(communities).where(eq(communities.id, id));
  return c.json({ success: true });
});

// POST /:id/join — Join a community
communitiesApp.post("/:id/join", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);
  if (community.isArchived) return c.json({ error: "This community is archived" }, 400);

  const inserted = await db
    .insert(communityMembers)
    .values({ communityId: id, userId, role: "member" })
    .onConflictDoNothing()
    .returning({ id: communityMembers.id });

  if (inserted.length > 0) {
    await db
      .update(communities)
      .set({ memberCount: sql`${communities.memberCount} + 1` })
      .where(eq(communities.id, id));
  }

  return c.json({ success: true, isMember: true });
});

// DELETE /:id/join — Leave a community
communitiesApp.delete("/:id/join", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const deleted = await db
    .delete(communityMembers)
    .where(
      and(eq(communityMembers.communityId, id), eq(communityMembers.userId, userId))
    )
    .returning({ id: communityMembers.id });

  if (deleted.length > 0) {
    await db
      .update(communities)
      .set({ memberCount: sql`greatest(${communities.memberCount} - 1, 0)` })
      .where(eq(communities.id, id));
  }

  return c.json({ success: true, isMember: false });
});

// GET /:id/members — Member list (moderators first)
communitiesApp.get("/:id/members", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");
  const { limit, offset } = getPagination(c, 50);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const items = await db
    .select({
      id: communityMembers.id,
      role: communityMembers.role,
      joinedAt: communityMembers.joinedAt,
      user: {
        id: profiles.id,
        fullName: profiles.fullName,
        department: profiles.department,
      },
    })
    .from(communityMembers)
    .innerJoin(profiles, eq(communityMembers.userId, profiles.id))
    .where(eq(communityMembers.communityId, id))
    .orderBy(desc(communityMembers.role), asc(communityMembers.joinedAt))
    .limit(limit)
    .offset(offset);

  return c.json({
    items,
    total: community.memberCount,
    hasMore: offset + items.length < community.memberCount,
  });
});

/** Load a membership row scoped to a community. */
async function getMembershipRow(communityId: string, memberId: string) {
  const [row] = await db
    .select()
    .from(communityMembers)
    .where(
      and(
        eq(communityMembers.id, memberId),
        eq(communityMembers.communityId, communityId)
      )
    )
    .limit(1);
  return row ?? null;
}

// PATCH /:id/members/:memberId — Promote/demote a member (owner/admin/community.manage)
communitiesApp.patch("/:id/members/:memberId", async (c) => {
  const id = c.req.param("id");
  const memberId = c.req.param("memberId");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const allowed = await canManageCommunity(
    role,
    userId,
    university,
    c.get("department"),
    community
  );
  if (!allowed) {
    return c.json({ error: "Forbidden — only the owner, an admin or a manager can change roles" }, 403);
  }

  const body = await c.req.json().catch(() => null);
  const newRole = body?.role;
  if (newRole !== "member" && newRole !== "moderator") {
    return c.json({ error: "role must be 'member' or 'moderator'" }, 400);
  }

  const membership = await getMembershipRow(id, memberId);
  if (!membership) return c.json({ error: "Member not found" }, 404);

  // The owner's authority comes from `createdBy`; keep their row a moderator.
  if (community.createdBy === membership.userId) {
    return c.json({ error: "The owner's role cannot be changed" }, 400);
  }

  const [updated] = await db
    .update(communityMembers)
    .set({ role: newRole })
    .where(eq(communityMembers.id, memberId))
    .returning();

  return c.json(updated);
});

// DELETE /:id/members/:memberId — Remove a member (owner/moderator/admin)
communitiesApp.delete("/:id/members/:memberId", async (c) => {
  const id = c.req.param("id");
  const memberId = c.req.param("memberId");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const actorMembership = await getMembership(id, userId);
  if (!canModerate(role, userId, community, actorMembership?.role)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const membership = await getMembershipRow(id, memberId);
  if (!membership) return c.json({ error: "Member not found" }, 404);

  if (community.createdBy === membership.userId) {
    return c.json({ error: "The owner cannot be removed" }, 400);
  }

  // A community moderator may only remove regular members.
  const isPrivileged =
    isAdmin(role) ||
    community.createdBy === userId ||
    (await hasPermission(role, userId, university, c.get("department"), "community.manage"));
  if (membership.role === "moderator" && !isPrivileged) {
    return c.json({ error: "Only the owner or an admin can remove a moderator" }, 403);
  }

  await db.delete(communityMembers).where(eq(communityMembers.id, memberId));
  await db
    .update(communities)
    .set({ memberCount: sql`greatest(${communities.memberCount} - 1, 0)` })
    .where(eq(communities.id, id));

  return c.json({ success: true });
});

// ==========================================
// POSTS
// ==========================================

// GET /:id/posts — Community feed
communitiesApp.get("/:id/posts", async (c) => {
  const id = c.req.param("id");
  const university = c.get("universityName");
  const userId = c.get("userId");
  const { limit, offset } = getPagination(c);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const countRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(communityPosts)
    .where(eq(communityPosts.communityId, id));
  const total = Number(countRow[0]?.count || 0);

  const items = await db
    .select({
      id: communityPosts.id,
      content: communityPosts.content,
      imageUrl: communityPosts.imageUrl,
      createdAt: communityPosts.createdAt,
      updatedAt: communityPosts.updatedAt,
      authorId: communityPosts.authorId,
      author: {
        id: profiles.id,
        fullName: profiles.fullName,
        role: profiles.role,
      },
      commentCount: sql<number>`(
        select count(*)::int from community_comments cc where cc.post_id = ${communityPosts.id}
      )`,
    })
    .from(communityPosts)
    .leftJoin(profiles, eq(communityPosts.authorId, profiles.id))
    .where(eq(communityPosts.communityId, id))
    .orderBy(desc(communityPosts.createdAt))
    .limit(limit)
    .offset(offset);

  const membership = await getMembership(id, userId);
  const canModerateFeed = canModerate(c.get("userRole"), userId, community, membership?.role);

  return c.json({
    items,
    total,
    hasMore: offset + items.length < total,
    canPost: Boolean(membership) || isAdmin(c.get("userRole")),
    canModerate: canModerateFeed,
  });
});

// POST /:id/posts — Create a post (members, moderators, admins)
communitiesApp.post("/:id/posts", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);
  if (community.isArchived) return c.json({ error: "This community is archived" }, 400);

  const membership = await getMembership(id, userId);
  const canPost = Boolean(membership) || canModerate(role, userId, community, membership?.role);
  if (!canPost) {
    return c.json({ error: "Join the community to post" }, 403);
  }

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON body" }, 400);

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content.length < 1 || content.length > 5000) {
    return c.json({ error: "Post must be 1–5000 characters" }, 400);
  }
  const imageUrl =
    typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl : null;

  const [created] = await db
    .insert(communityPosts)
    .values({ communityId: id, authorId: userId, content, imageUrl })
    .returning();

  await db
    .update(communities)
    .set({ postCount: sql`${communities.postCount} + 1` })
    .where(eq(communities.id, id));

  return c.json(created, 201);
});

// DELETE /:id/posts/:postId — Delete a post (author / moderator / admin)
communitiesApp.delete("/:id/posts/:postId", async (c) => {
  const id = c.req.param("id");
  const postId = c.req.param("postId");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const [post] = await db
    .select()
    .from(communityPosts)
    .where(and(eq(communityPosts.id, postId), eq(communityPosts.communityId, id)))
    .limit(1);
  if (!post) return c.json({ error: "Post not found" }, 404);

  const membership = await getMembership(id, userId);
  const isAuthor = post.authorId === userId;
  if (!isAuthor && !canModerate(role, userId, community, membership?.role)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db.delete(communityPosts).where(eq(communityPosts.id, postId));
  await db
    .update(communities)
    .set({ postCount: sql`greatest(${communities.postCount} - 1, 0)` })
    .where(eq(communities.id, id));

  return c.json({ success: true });
});

// ==========================================
// COMMENTS
// ==========================================

/** Resolve a post inside a tenant-scoped community. */
async function getPost(communityId: string, postId: string) {
  const [post] = await db
    .select()
    .from(communityPosts)
    .where(and(eq(communityPosts.id, postId), eq(communityPosts.communityId, communityId)))
    .limit(1);
  return post ?? null;
}

// GET /:id/posts/:postId/comments — List comments (oldest first)
communitiesApp.get("/:id/posts/:postId/comments", async (c) => {
  const id = c.req.param("id");
  const postId = c.req.param("postId");
  const university = c.get("universityName");
  const { limit, offset } = getPagination(c, 20);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const post = await getPost(id, postId);
  if (!post) return c.json({ error: "Post not found" }, 404);

  const items = await db
    .select({
      id: communityComments.id,
      content: communityComments.content,
      createdAt: communityComments.createdAt,
      authorId: communityComments.authorId,
      author: {
        id: profiles.id,
        fullName: profiles.fullName,
        role: profiles.role,
      },
    })
    .from(communityComments)
    .leftJoin(profiles, eq(communityComments.authorId, profiles.id))
    .where(eq(communityComments.postId, postId))
    .orderBy(asc(communityComments.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json({ items, hasMore: items.length === limit });
});

// POST /:id/posts/:postId/comments — Add a comment (members, moderators, admins)
communitiesApp.post("/:id/posts/:postId/comments", async (c) => {
  const id = c.req.param("id");
  const postId = c.req.param("postId");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const post = await getPost(id, postId);
  if (!post) return c.json({ error: "Post not found" }, 404);

  const membership = await getMembership(id, userId);
  const canComment =
    Boolean(membership) || canModerate(role, userId, community, membership?.role);
  if (!canComment) {
    return c.json({ error: "Join the community to comment" }, 403);
  }

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "Invalid JSON body" }, 400);

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content.length < 1 || content.length > 2000) {
    return c.json({ error: "Comment must be 1–2000 characters" }, 400);
  }

  const [created] = await db
    .insert(communityComments)
    .values({ postId, authorId: userId, content })
    .returning();

  return c.json(created, 201);
});

// DELETE /:id/posts/:postId/comments/:commentId — Delete a comment
communitiesApp.delete("/:id/posts/:postId/comments/:commentId", async (c) => {
  const id = c.req.param("id");
  const postId = c.req.param("postId");
  const commentId = c.req.param("commentId");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const university = c.get("universityName");

  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const community = await getCommunity(id, university);
  if (!community) return c.json({ error: "Community not found" }, 404);

  const post = await getPost(id, postId);
  if (!post) return c.json({ error: "Post not found" }, 404);

  const [comment] = await db
    .select()
    .from(communityComments)
    .where(
      and(eq(communityComments.id, commentId), eq(communityComments.postId, postId))
    )
    .limit(1);
  if (!comment) return c.json({ error: "Comment not found" }, 404);

  const membership = await getMembership(id, userId);
  const isAuthor = comment.authorId === userId;
  if (!isAuthor && !canModerate(role, userId, community, membership?.role)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db.delete(communityComments).where(eq(communityComments.id, commentId));
  return c.json({ success: true });
});

export default communitiesApp;
