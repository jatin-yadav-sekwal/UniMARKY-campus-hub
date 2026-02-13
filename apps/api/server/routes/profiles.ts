import { Hono } from "hono";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { verifyIdCard } from "../services/ai-verify";

import type { Env } from "../middleware/auth";

const profilesApp = new Hono<Env>();

// Get Profile Me
profilesApp.get("/me", async (c) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const result = await db.select().from(profiles).where(eq(profiles.id, userId));
  if (result.length === 0) return c.json({ error: "Profile not found" }, 404);
  return c.json(result[0]);
});

// Onboarding Completion
profilesApp.patch("/onboarding", async (c) => {
    const userId = c.get("userId");
    const { universityName } = await c.req.json();

    if (!universityName) {
        return c.json({ error: "University Name is required" }, 400);
    }

    const updated = await db.update(profiles)
        .set({ 
            universityName: universityName,
            onboardingCompleted: true 
        })
        .where(eq(profiles.id, userId))
        .returning();

    return c.json(updated[0]);
});

// Get Profile By ID (Admin/Public?)
profilesApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(profiles).where(eq(profiles.id, id));
  if (result.length === 0) return c.json({ error: "Profile not found" }, 404);
  return c.json(result[0]);
});

// Update Profile - Only allow updating certain fields
profilesApp.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  
  // Security: Only allow users to update their own profile
  if (id !== userId) {
    return c.json({ error: "Unauthorized - can only update your own profile" }, 403);
  }
  
  const body = await c.req.json();
  
  // Only allow updating specific fields (not fullName or universityName)
  const allowedFields: Record<string, any> = {};
  
  if (body.department !== undefined) {
    allowedFields.department = body.department;
  }
  if (body.class !== undefined) {
    allowedFields.class = body.class;
  }
  if (body.mobileNumber !== undefined) {
    allowedFields.mobileNumber = body.mobileNumber;
  }
  
  // If no valid fields to update
  if (Object.keys(allowedFields).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }
  
  const updated = await db.update(profiles).set(allowedFields).where(eq(profiles.id, id)).returning();
  
  if (updated.length === 0) {
    return c.json({ error: "Profile not found" }, 404);
  }
  
  return c.json(updated[0]);
});

// AI Verification Trigger
profilesApp.post("/:id/verify", async (c) => {
  const id = c.req.param("id");
  const { idCardUrl } = await c.req.json();

  if (!idCardUrl) {
    return c.json({ error: "ID Card URL required" }, 400);
  }

  // Trigger Gemini Vision check (mock)
  const isValid = await verifyIdCard(idCardUrl);

  if (isValid) {
    await db.update(profiles).set({ isVerified: true, idCardUrl }).where(eq(profiles.id, id));
    return c.json({ success: true, message: "Profile verified successfully" });
  } else {
    return c.json({ success: false, message: "Verification failed. Image unclear or invalid." }, 400);
  }
});

export default profilesApp;
