import type { Context, MiddlewareHandler } from "hono";
import { getConnInfo } from "@hono/node-server/conninfo";

type Bucket = { count: number; resetAt: number };

// Per-instance in-memory buckets. This stops request floods on a single API
// process; for multi-instance or edge protection pair it with Cloudflare /
// Upstash rate limiting (see design.md).
const buckets = new Map<string, Bucket>();

function clientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  try {
    return getConnInfo(c).remote.address ?? "unknown";
  } catch {
    return "unknown";
  }
}

export function rateLimit(options: {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}): MiddlewareHandler {
  const { windowMs, max, keyPrefix = "global" } = options;

  return async (c, next) => {
    const key = `${keyPrefix}:${clientIp(c)}`;
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
    } else if (bucket.count >= max) {
      c.header("Retry-After", String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))));
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    } else {
      bucket.count += 1;
    }

    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }

    await next();
  };
}
