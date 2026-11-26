import { Hono } from "hono";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import {
  accommodationListings,
  communities,
  communityComments,
  communityMembers,
  communityPosts,
  foodListings,
  lostFound,
  marketplaceItems,
  roleRequests,
  studyMaterials,
  userPermissions,
} from "../db/schema";
import type { Env } from "../middleware/auth";

const accountApp = new Hono<Env>();

/**
 * Delete the signed-in account and its content.
 *
 * The API connects to Postgres as the project owner, so removing the
 * `auth.users` row also removes the profile, sessions, identities, likes,
 * memberships and every other cascading row. Rows whose foreign key is
 * SET NULL are cleaned up explicitly before the final delete.
 */
accountApp.delete("/", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    await db.transaction(async (tx) => {
      // Communities the user created: hand to an existing moderator when
      // possible, otherwise remove the empty community.
      const owned = await tx
        .select()
        .from(communities)
        .where(eq(communities.createdBy, userId));

      for (const community of owned) {
        const members = await tx
          .select()
          .from(communityMembers)
          .where(eq(communityMembers.communityId, community.id));

        const successor = members
          .filter((m) => m.userId !== userId)
          .sort((a, b) => (a.role === "moderator" ? -1 : 1) - (b.role === "moderator" ? -1 : 1))[0];

        if (successor) {
          await tx
            .update(communities)
            .set({ createdBy: successor.userId, updatedAt: new Date() })
            .where(eq(communities.id, community.id));
          await tx
            .update(communityMembers)
            .set({ role: "moderator" })
            .where(
              and(
                eq(communityMembers.communityId, community.id),
                eq(communityMembers.userId, successor.userId)
              )
            );
        } else {
          await tx.delete(communities).where(eq(communities.id, community.id));
        }
      }

      // Personal content — explicit so it does not depend on the auth cascade.
      await tx.delete(communityComments).where(eq(communityComments.authorId, userId));
      await tx.delete(communityPosts).where(eq(communityPosts.authorId, userId));
      await tx.delete(marketplaceItems).where(eq(marketplaceItems.sellerId, userId));
      await tx.delete(lostFound).where(eq(lostFound.reporterId, userId));
      await tx.delete(foodListings).where(eq(foodListings.ownerId, userId));
      await tx.delete(accommodationListings).where(eq(accommodationListings.ownerId, userId));
      await tx.delete(studyMaterials).where(eq(studyMaterials.uploadedBy, userId));

      // FKs that are NO ACTION on purpose must be cleared first.
      await tx.update(roleRequests).set({ reviewedBy: null }).where(eq(roleRequests.reviewedBy, userId));
      await tx.update(userPermissions).set({ grantedBy: null }).where(eq(userPermissions.grantedBy, userId));

      // Final delete: cascades the profile, sessions, identities and likes.
      await tx.execute(sql`delete from auth.users where id = ${userId}`);
    });

    return c.json({ deleted: true });
  } catch (err) {
    console.error("[account] deletion failed:", err);
    return c.json({ error: "Could not delete the account. Please contact support." }, 500);
  }
});

export default accountApp;
