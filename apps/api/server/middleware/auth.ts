import { createMiddleware } from "hono/factory";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";
import { isOnboarded } from "../utils/onboarding";

// Define the custom context variables type
export type Env = {
  Variables: {
    userId: string;
    universityName: string;
    department: string;
    onboardingCompleted: boolean;
    userRole: string;
  };
};

const TOKEN_ERRORS = [
  "JwtTokenExpired",
  "JwtTokenInvalid",
  "JwtTokenNotBefore",
  "JwtTokenSignatureMismatched",
  "JwtAlgorithmNotImplemented",
  "JwtAlgorithmNotAllowed",
];

function isTokenError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return TOKEN_ERRORS.includes(err.name) || err.name.startsWith("Jwt");
}

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Everything that can legitimately fail with a 401 happens in this block.
  let userId: string;
  try {
    // Fetch the correct public key from Supabase JWKS (cached)
    const publicKey = await getSupabasePublicKey(token);

    // Verify Token using fetched Public Key (ES256)
    const payload = await verify(token, publicKey, "ES256");

    // Supabase JWT 'sub' claim is the user ID
    userId = payload.sub as string;

    if (!userId) {
      return c.json({ error: "Invalid Token" }, 401);
    }
  } catch (err) {
    if (isTokenError(err)) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }
    console.error("[auth] JWT verification failed:", err);
    return c.json({ error: "Authentication unavailable" }, 503);
  }

  // A database failure here is a server problem, not an auth problem.
  // Let it surface as a 500 instead of silently downgrading the user.
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });

  const path = c.req.path;

  // A user who has not finished onboarding still needs to read their own
  // onboarding state and submit the onboarding form. Everything else is
  // gated until onboarding is complete.
  const isSelfProfileRoute =
    path.endsWith("/profiles/me") || path.endsWith("/profiles/onboarding");

  if (!profile) {
    // User exists in Supabase Auth but has no profile row yet (fresh signup,
    // typically via Google). Only the self routes are reachable.
    if (!isSelfProfileRoute) {
      return c.json({ error: "PROFILE_REQUIRED" }, 403);
    }

    c.set("userId", userId);
    c.set("universityName", "");
    c.set("department", "");
    c.set("onboardingCompleted", false);
    c.set("userRole", "normal");

    return next();
  }

  c.set("userId", profile.id);
  c.set("universityName", profile.universityName || "");
  c.set("department", profile.department || "");

  // Treat legacy rows (university set, flag not) as onboarded so returning
  // users are never sent back through the flow.
  const onboarded = isOnboarded(profile);
  c.set("onboardingCompleted", onboarded);
  c.set("userRole", profile.role || "normal");

  // Enforce onboarding for everything except the self routes above.
  if (!onboarded && !isSelfProfileRoute) {
    return c.json({ error: "ONBOARDING_REQUIRED" }, 403);
  }

  await next();
});
