/**
 * Environment validation. Fail loudly at boot instead of silently
 * degrading in production.
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

  if (allowedOrigins().length === 0) {
    console.warn(
      "[env] No CORS origins configured. Browser clients on other origins will be blocked. " +
        "Set CORS_ORIGINS (comma separated) if you still call the API cross-origin."
    );
  }
}

/**
 * Origins allowed to call the API from a browser.
 * The web app should use a same-origin `/api` rewrite, so this list is mainly
 * for local development, previews and future clients.
 */
export function allowedOrigins(): string[] {
  return [
    ...(process.env.CORS_ORIGINS ?? "").split(","),
    process.env.CORS_ORIGIN,
    process.env.VITE_DEV_SERVER_URL,
    process.env.VITE_WEB_URL,
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));
}
