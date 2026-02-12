import { createMiddleware } from "hono/factory";
import type { Env } from "./auth";

/**
 * Middleware factory that restricts route access to specific user roles.
 * Must be used after authMiddleware.
 */
export function requireRole(...allowedRoles: string[]) {
  return createMiddleware<Env>(async (c, next) => {
    const userRole = c.get("userRole");

    if (!userRole || !allowedRoles.includes(userRole)) {
      return c.json(
        { error: `Forbidden — requires one of: ${allowedRoles.join(", ")}` },
        403
      );
    }

    await next();
  });
}
