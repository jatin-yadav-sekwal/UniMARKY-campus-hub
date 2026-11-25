/**
 * Environment validation and CORS policy.
 *
 * Nothing here depends on the web app's `VITE_*` variables: the API is its own
 * deployment and only trusts the origins configured on the server.
 */

const REQUIRED = ["DATABASE_URL", "SUPABASE_URL"] as const;

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[env] Missing required environment variables: ${missing.join(", ")}. ` +
        "The API cannot start."
    );
    process.exit(1);
  }

  if (allowedOrigins().length === 0 && allowedOriginPatterns().length === 0) {
    console.warn(
      "[env] No CORS origins configured. Browser clients on other origins will be " +
        "blocked. Set CORS_ORIGINS (comma separated) and/or CORS_ORIGIN_PATTERNS " +
        "(wildcards) if you still call the API cross-origin."
    );
  }
}

/** Split a comma-separated env var into trimmed, non-empty values. */
function splitList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Lower-case and drop a trailing slash so `https://x/` and `https://x` match. */
function normalizeOrigin(origin: string): string {
  return origin.trim().toLowerCase().replace(/\/+$/, "");
}

/**
 * Exact browser origins allowed to call the API.
 *
 * `CORS_ORIGINS` (comma separated) is the canonical source; `CORS_ORIGIN` and
 * `WEB_URL` are single-value aliases kept for convenience.
 */
export function allowedOrigins(): string[] {
  const values = [
    ...splitList(process.env.CORS_ORIGINS),
    process.env.CORS_ORIGIN,
    process.env.WEB_URL,
  ];

  return [
    ...new Set(
      values
        .map((origin) => (origin ? normalizeOrigin(origin) : ""))
        .filter((origin): origin is string => origin.length > 0)
    ),
  ];
}

/**
 * Wildcard origin patterns, e.g. `https://*.vercel.app` for preview deploys.
 * `*` matches any run of characters.
 */
export function allowedOriginPatterns(): string[] {
  return [
    ...new Set(splitList(process.env.CORS_ORIGIN_PATTERNS).map(normalizeOrigin)),
  ];
}

/** Compile a wildcard origin pattern into an anchored, case-insensitive regex. */
function patternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

/**
 * True when `origin` is explicitly allowed or matches a wildcard pattern.
 * A missing `Origin` header (same-origin rewrite, curl, server-to-server) is
 * not a CORS request and always returns `false`.
 */
export function isOriginAllowed(origin: string | undefined | null): boolean {
  if (!origin) return false;

  const normalized = normalizeOrigin(origin);
  if (allowedOrigins().includes(normalized)) return true;

  return allowedOriginPatterns().some((pattern) =>
    patternToRegExp(pattern).test(normalized)
  );
}
