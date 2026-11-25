import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allowedOrigins,
  allowedOriginPatterns,
  isOriginAllowed,
} from "./env";

const CORS_KEYS = [
  "CORS_ORIGINS",
  "CORS_ORIGIN",
  "WEB_URL",
  "CORS_ORIGIN_PATTERNS",
] as const;

/** Reset the CORS env vars, then apply only the provided values. */
function setCorsEnv(env: Partial<Record<(typeof CORS_KEYS)[number], string>>) {
  for (const key of CORS_KEYS) delete process.env[key];
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) process.env[key] = value;
  }
}

test("normalizes and de-duplicates exact origins", () => {
  setCorsEnv({
    CORS_ORIGINS:
      "https://unimarky.app, http://localhost:5173/, https://unimarky.app",
    WEB_URL: "https://www.unimarky.app",
  });

  assert.deepEqual(allowedOrigins(), [
    "https://unimarky.app",
    "http://localhost:5173",
    "https://www.unimarky.app",
  ]);
});

test("matches exact origins case-insensitively, ignoring a trailing slash", () => {
  setCorsEnv({ CORS_ORIGINS: "https://unimarky.app" });

  assert.equal(isOriginAllowed("https://unimarky.app"), true);
  assert.equal(isOriginAllowed("https://UNIMARKY.app/"), true);
  assert.equal(isOriginAllowed("https://evil.app"), false);
  assert.equal(isOriginAllowed("https://unimarky.app.evil.com"), false);
});

test("matches wildcard origin patterns without over-matching", () => {
  setCorsEnv({ CORS_ORIGIN_PATTERNS: "https://*.vercel.app" });

  assert.deepEqual(allowedOriginPatterns(), ["https://*.vercel.app"]);
  assert.equal(
    isOriginAllowed("https://unimarky-git-main-team.vercel.app"),
    true
  );
  assert.equal(isOriginAllowed("https://unimarky.vercel.app"), true);
  assert.equal(isOriginAllowed("https://evil-vercel.app"), false);
  assert.equal(isOriginAllowed("http://unimarky.vercel.app"), false);
});

test("treats a missing Origin header as not a CORS request", () => {
  setCorsEnv({ CORS_ORIGINS: "https://unimarky.app" });

  assert.equal(isOriginAllowed(undefined), false);
  assert.equal(isOriginAllowed(""), false);
});

test("accepts the legacy CORS_ORIGIN and WEB_URL aliases", () => {
  setCorsEnv({
    CORS_ORIGIN: "http://localhost:3000",
    WEB_URL: "https://app.unimarky.dev",
  });

  assert.equal(isOriginAllowed("http://localhost:3000"), true);
  assert.equal(isOriginAllowed("https://app.unimarky.dev"), true);
});

test("escapes regex metacharacters in patterns", () => {
  setCorsEnv({ CORS_ORIGIN_PATTERNS: "https://app.unimarky.dev" });

  assert.equal(isOriginAllowed("https://app.unimarky.dev"), true);
  assert.equal(isOriginAllowed("https://appXunimarky.dev"), false);
  assert.equal(isOriginAllowed("https://app.unimarkyXdev"), false);
});
