import { createMiddleware } from "hono/factory";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
// We use a small jwt lib or standard crypto if hono/jwt is too basic for customization, 
// but hono/jwt is standard.
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

// Define the custom context variables type
export type Env = {
  Variables: {
    userId: string;
    universityName: string;
    onboardingCompleted: boolean;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
     return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  // const secret = process.env.SUPABASE_JWT_SECRET;
  
  // if (!secret) {
  //     console.error("Missing SUPABASE_JWT_SECRET");
  //     return c.json({ error: "Server Configuration Error" }, 500);
  // }

  try {
      // Fetch the correct public key from Supabase JWKS (cached)
      const publicKey = await getSupabasePublicKey(token);

      // Verify Token using fetched Public Key (ES256)
      const payload = await verify(token, publicKey, 'ES256');
      
      // Supabase JWT 'sub' claim is the user ID
      const userId = payload.sub as string;
      
      if (!userId) {
          throw new Error("Invalid Token");
      }

      // Check against our profiles table to get context
      // Note: Supabase Auth handles the user existence, but we need our local profile data
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
      });

      if (profile) {
          c.set("userId", profile.id);
          c.set("universityName", profile.universityName || "Unknown University");
          c.set("onboardingCompleted", profile.onboardingCompleted || false);
          
          // Enforce Onboarding
          // We allow requests to the onboarding endpoint itself (to complete it)
          // And maybe read-only endpoints? No, strictly block protected routes.
          const path = c.req.path;
          const isOnboardingRoute = path.includes("profiles/onboarding");
          
          if (!profile.onboardingCompleted && !isOnboardingRoute) {
               // We return a specific error code so frontend knows to redirect
               return c.json({ error: "ONBOARDING_REQUIRED" }, 403);
          }

      } else {
           // User exists in Auth but not in Profiles? Trigger failed?
           // We might fallback or basic set userId
           c.set("userId", userId);
           // c.set("universityName", null); 
      }

      await next();
      
  } catch (err) {
      console.error("JWT Verification Failed:", err);
      return c.json({ error: "Invalid Token" }, 401);
  }
});
