import { createMiddleware } from "hono/factory";
import type { Env } from "./auth";
import { hasPermission, isAdmin, type Permission } from "./policies";

/** Top-tier admin gate (role `userX`). */
export function requireAdmin() {
  return createMiddleware<Env>(async (c, next) => {
    if (!isAdmin(c.get("userRole"))) {
      return c.json({ error: "Forbidden — admin only" }, 403);
    }

    await next();
  });
}

/**
 * Grants access only when the user holds the required capability
 * (directly, via scope, or by being an admin).
 */
export function requirePermission(permission: Permission) {
  return createMiddleware<Env>(async (c, next) => {
    const allowed = await hasPermission(
      c.get("userRole"),
      c.get("userId"),
      c.get("universityName"),
      c.get("department"),
      permission
    );

    if (!allowed) {
      return c.json({ error: "Forbidden — you do not have permission to do this" }, 403);
    }

    await next();
  });
}
