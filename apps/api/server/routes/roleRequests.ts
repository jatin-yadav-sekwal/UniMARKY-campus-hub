import { Hono } from "hono";
import { db } from "../db";
import { roleRequests, profiles, userPermissions, auditLog } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type { Env } from "../middleware/auth";
import { requireAdmin } from "../middleware/permission";

const roleRequestsApp = new Hono<Env>();

/**
 * Approving a publisher request grants these capabilities, scoped to the
 * requester's university. The legacy `role = superuser` upgrade is kept for
 * the transition period (see policies.ts).
 */
const GRANTED_PERMISSIONS = ["housing.manage", "study.manage", "community.create"] as const;

// POST / - Submit a role upgrade request (normal users only)
roleRequestsApp.post("/", async (c) => {
  const userId = c.get("userId");
  const userRole = c.get("userRole");

  if (userRole !== "normal") {
    return c.json({ error: "Only normal users can request a role upgrade" }, 400);
  }

  const body = await c.req.json();

  if (!body.reason || body.reason.trim().length < 10) {
    return c.json({ error: "Please provide a reason (at least 10 characters)" }, 400);
  }

  // Check if user already has a pending request
  const existing = await db
    .select()
    .from(roleRequests)
    .where(and(eq(roleRequests.userId, userId), eq(roleRequests.status, "pending")));

  if (existing.length > 0) {
    return c.json({ error: "You already have a pending request" }, 409);
  }

  const newRequest = await db
    .insert(roleRequests)
    .values({
      userId,
      reason: body.reason.trim(),
      requestedRole: "superuser",
    })
    .returning();

  return c.json(newRequest[0], 201);
});

// GET /mine - Get current user's role request status
roleRequestsApp.get("/mine", async (c) => {
  const userId = c.get("userId");

  const requests = await db
    .select()
    .from(roleRequests)
    .where(eq(roleRequests.userId, userId))
    .orderBy(desc(roleRequests.createdAt));

  return c.json(requests);
});

// GET / - List all pending requests (admins only)
roleRequestsApp.get("/", requireAdmin(), async (c) => {
  const status = c.req.query("status") || "pending";

  const requests = await db
    .select({
      request: roleRequests,
      user: {
        id: profiles.id,
        fullName: profiles.fullName,
        universityName: profiles.universityName,
        department: profiles.department,
        mobileNumber: profiles.mobileNumber,
        role: profiles.role,
      },
    })
    .from(roleRequests)
    .leftJoin(profiles, eq(roleRequests.userId, profiles.id))
    .where(eq(roleRequests.status, status as "pending" | "approved" | "rejected"))
    .orderBy(desc(roleRequests.createdAt));

  return c.json(requests);
});

// PATCH /:id - Approve or reject a request (admins only)
roleRequestsApp.patch("/:id", requireAdmin(), async (c) => {
  const requestId = c.req.param("id");
  const reviewerId = c.get("userId");
  const body = await c.req.json();

  if (!body.status || !["approved", "rejected"].includes(body.status)) {
    return c.json({ error: "Status must be 'approved' or 'rejected'" }, 400);
  }

  // Get the request
  const request = await db.select().from(roleRequests).where(eq(roleRequests.id, requestId));
  if (request.length === 0) return c.json({ error: "Request not found" }, 404);
  if (request[0].status !== "pending") {
    return c.json({ error: "This request has already been reviewed" }, 400);
  }

  // Update the request
  const updated = await db
    .update(roleRequests)
    .set({
      status: body.status,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    })
    .where(eq(roleRequests.id, requestId))
    .returning();

  // If approved, update the user's role and grant scoped permissions
  if (body.status === "approved") {
    await db.update(profiles).set({ role: "superuser" }).where(eq(profiles.id, request[0].userId));

    try {
      const [requester] = await db
        .select({ universityName: profiles.universityName })
        .from(profiles)
        .where(eq(profiles.id, request[0].userId));

      // Skip capabilities the user already holds (repeated approvals)
      const existingPerms = await db
        .select({ permission: userPermissions.permission })
        .from(userPermissions)
        .where(eq(userPermissions.userId, request[0].userId));
      const held = new Set(existingPerms.map((p) => p.permission));

      const toGrant = GRANTED_PERMISSIONS.filter((p) => !held.has(p));
      if (toGrant.length > 0) {
        await db
          .insert(userPermissions)
          .values(
            toGrant.map((permission) => ({
              userId: request[0].userId,
              permission,
              scopeType: "university" as const,
              scopeValue: requester?.universityName ?? null,
              grantedBy: reviewerId,
            }))
          )
          .onConflictDoNothing();
      }
    } catch (err) {
      // The user_permissions table may not exist until migrations are applied.
      console.error("[roleRequests] Failed to grant scoped permissions:", err);
    }
  }

  // Audit trail for privileged actions (best effort)
  try {
    await db.insert(auditLog).values({
      actorId: reviewerId,
      action: body.status === "approved" ? "role_request.approved" : "role_request.rejected",
      entityType: "role_request",
      entityId: requestId,
      metadata: {
        targetUser: request[0].userId,
        requestedRole: request[0].requestedRole,
      },
    });
  } catch (err) {
    console.error("[roleRequests] Failed to write audit log:", err);
  }

  return c.json(updated[0]);
});

export default roleRequestsApp;
