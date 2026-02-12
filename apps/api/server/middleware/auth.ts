import { createMiddleware } from "hono/factory";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verify } from "hono/jwt";
import { getSupabasePublicKey } from "../utils/jwks";

// Define the custom context variables type
export type Env = {
  Variables: {
    userId: string;
    universityName: string;
    onboardingCompleted: boolean;
    userRole: string;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
     return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();

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
      const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
      });

      if (profile) {
          c.set("userId", profile.id);
          c.set("universityName", profile.universityName || "Unknown University");
          c.set("onboardingCompleted", profile.onboardingCompleted || false);
          c.set("userRole", profile.role || "normal");
          
          // Enforce Onboarding
          const path = c.req.path;
          const isOnboardingRoute = path.includes("profiles/onboarding");
          
          if (!profile.onboardingCompleted && !isOnboardingRoute) {
               return c.json({ error: "ONBOARDING_REQUIRED" }, 403);
          }

      } else {
           // User exists in Auth but not in Profiles
           c.set("userId", userId);
           c.set("userRole", "normal");
      }

      await next();
      
  } catch (err) {
      console.error("JWT Verification Failed:", err);
      return c.json({ error: "Invalid Token" }, 401);
  }
});
