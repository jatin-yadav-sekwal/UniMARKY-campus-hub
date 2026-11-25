import type { Context } from "hono";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses and clamps `limit` / `offset` so invalid or hostile values never
 * reach SQL (NaN, negative offsets, unbounded page sizes).
 */
export function getPagination(c: Context, defaultLimit = DEFAULT_LIMIT) {
  const rawLimit = Number.parseInt(c.req.query("limit") ?? "", 10);
  const rawOffset = Number.parseInt(c.req.query("offset") ?? "", 10);

  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : defaultLimit;

  const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

  return { limit, offset };
}
