import type { MiddlewareHandler } from "hono";

/**
 * One structured JSON line per request. JSON is what Render/Supabase log
 * drains can parse; no Authorization header or body is ever logged.
 */
export function requestLog(): MiddlewareHandler {
  return async (c, next) => {
    const started = performance.now();
    const requestId = crypto.randomUUID();
    c.header("X-Request-Id", requestId);

    await next();

    const durationMs = Math.round(performance.now() - started);
    console.log(
      JSON.stringify({
        level: durationMs > 1000 ? "warn" : "info",
        type: "request",
        requestId,
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        durationMs,
        userId: c.get("userId") ?? undefined,
        ip: c.req.header("x-forwarded-for")?.split(",")[0]?.trim(),
      })
    );
  };
}
