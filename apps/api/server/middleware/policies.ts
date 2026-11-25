import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "../db";
import { userPermissions } from "../db/schema";

export const ADMIN_ROLE = "userX";
export const PUBLISHER_ROLE = "superuser";

export type Permission =
  | "food.manage"
  | "housing.manage"
  | "study.manage"
  | "community.create"
  | "community.manage"
  | "notice.publish"
  | "news.publish";

/** Top-tier admin: unrestricted inside the platform. */
export function isAdmin(role?: string): boolean {
  return role === ADMIN_ROLE;
}

/** Moderator: admins, plus content owners acting on their own content. */
export function canModify(
  role: string | undefined,
  userId: string | undefined,
  ownerId: string | null | undefined
): boolean {
  return Boolean(userId) && (userId === ownerId || isAdmin(role));
}

/** Tenant boundary for a single resource. */
export function belongsToUniversity(
  contextUniversity: string | undefined,
  resourceUniversity: string | null | undefined
): boolean {
  return Boolean(contextUniversity) && contextUniversity === resourceUniversity;
}

/**
 * Capability check with optional university/department scope.
 *
 * Transitional behaviour: existing `superuser` rows keep their historical
 * access to food/housing/study until admins start granting scoped
 * permissions through `user_permissions`. Admins bypass all checks.
 */
export async function hasPermission(
  role: string | undefined,
  userId: string | undefined,
  universityName: string | undefined,
  department: string | undefined,
  permission: Permission
): Promise<boolean> {
  if (isAdmin(role)) return true;

  if (
    role === PUBLISHER_ROLE &&
    (permission === "food.manage" ||
      permission === "housing.manage" ||
      permission === "study.manage")
  ) {
    return true;
  }

  if (!userId) return false;

  try {
    const rows = await db
      .select({ id: userPermissions.id })
      .from(userPermissions)
      .where(
        and(
          eq(userPermissions.userId, userId),
          eq(userPermissions.permission, permission),
          or(
            isNull(userPermissions.expiresAt),
            gt(userPermissions.expiresAt, new Date())
          ),
          or(
            eq(userPermissions.scopeType, "global"),
            and(
              eq(userPermissions.scopeType, "university"),
              or(
                isNull(userPermissions.scopeValue),
                eq(userPermissions.scopeValue, universityName ?? "")
              )
            ),
            and(
              eq(userPermissions.scopeType, "department"),
              or(
                isNull(userPermissions.scopeValue),
                eq(userPermissions.scopeValue, department ?? "")
              )
            )
          )
        )
      )
      .limit(1);

    return rows.length > 0;
  } catch (error) {
    // Fail closed. The table may not exist until the migration is applied.
    console.error("[policy] Permission check failed:", error);
    return false;
  }
}
