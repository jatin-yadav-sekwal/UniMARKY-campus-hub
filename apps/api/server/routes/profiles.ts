import { Hono } from "hono";
import type { Context } from "hono";
import { db } from "../db";
import { profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "../middleware/policies";
import { isOnboarded } from "../utils/onboarding";

import type { Env } from "../middleware/auth";

const profilesApp = new Hono<Env>();

/**
 * Fields safe to expose to other users. Never include mobileNumber or
 * idCardUrl here — those are only returned by /me.
 */
const PUBLIC_FIELDS = {
  id: profiles.id,
  fullName: profiles.fullName,
  universityName: profiles.universityName,
  department: profiles.department,
  class: profiles.class,
  isVerified: profiles.isVerified,
};

// Get Profile Me.
//
// Always answers 200 so the client can make a routing decision in one call:
//  - profileExists: false  -> brand new user, needs onboarding
//  - onboardingCompleted: false -> mid-onboarding
//  - onboardingCompleted: true  -> returning user, go straight to the app
profilesApp.get("/me", async (c) => {
  const userId = c.get("userId");
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  const result = await db.select().from(profiles).where(eq(profiles.id, userId));
  if (result.length === 0) {
    return c.json({ id: userId, onboardingCompleted: false, profileExists: false });
  }

  return c.json({
    ...result[0],
    onboardingCompleted: isOnboarded(result[0]),
    profileExists: true,
  });
});

// Update the signed-in user's profile.
async function updateMe(c: Context<Env>) {
  const userId = c.get("userId");

  if (!userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const body = await c.req.json();

  // Only allow updating specific fields. `role`, `isVerified` and `idCardUrl`
  // are deliberately not user-writable.
  const allowedFields: Record<string, any> = {};

  if (body.fullName !== undefined) allowedFields.fullName = body.fullName;
  if (body.universityName !== undefined) allowedFields.universityName = body.universityName;
  if (body.department !== undefined) allowedFields.department = body.department;
  if (body.class !== undefined) allowedFields.class = body.class;
  if (body.mobileNumber !== undefined) allowedFields.mobileNumber = body.mobileNumber;

  if (Object.keys(allowedFields).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  allowedFields.updatedAt = new Date();

  const updated = await db
    .update(profiles)
    .set(allowedFields)
    .where(eq(profiles.id, userId))
    .returning();

  if (updated.length === 0) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json(updated[0]);
}

profilesApp.patch("/me", updateMe);

// Onboarding Completion
profilesApp.patch("/onboarding", async (c) => {
  const userId = c.get("userId");
  const { universityName, mobileNumber, fullName } = await c.req.json();

  if (!universityName) {
    return c.json({ error: "University Name is required" }, 400);
  }

  // Validate required fields
  if (!mobileNumber || mobileNumber.length !== 10) {
    return c.json({ error: "Mobile number must be 10 digits" }, 400);
  }

  const valuesToUpdate: {
    universityName: string;
    fullName?: string;
    mobileNumber: string;
    onboardingCompleted: boolean;
    updatedAt: Date;
  } = {
    universityName,
    fullName: fullName || undefined,
    mobileNumber,
    onboardingCompleted: true,
    updatedAt: new Date(),
  };

  const updated = await db
    .insert(profiles)
    .values({
      id: userId,
      ...valuesToUpdate,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: valuesToUpdate,
    })
    .returning();

  return c.json(updated[0]);
});

// Get public profile by ID
profilesApp.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select(PUBLIC_FIELDS).from(profiles).where(eq(profiles.id, id));
  if (result.length === 0) return c.json({ error: "Profile not found" }, 404);
  return c.json(result[0]);
});

// Update Profile - Only yourself, and only safe fields.
profilesApp.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  if (id !== userId) {
    return c.json({ error: "Unauthorized - can only update your own profile" }, 403);
  }

  const body = await c.req.json();

  const allowedFields: Record<string, any> = {};

  if (body.fullName !== undefined) allowedFields.fullName = body.fullName;
  if (body.universityName !== undefined) allowedFields.universityName = body.universityName;
  if (body.department !== undefined) allowedFields.department = body.department;
  if (body.class !== undefined) allowedFields.class = body.class;
  if (body.mobileNumber !== undefined) allowedFields.mobileNumber = body.mobileNumber;

  if (Object.keys(allowedFields).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }

  allowedFields.updatedAt = new Date();

  const updated = await db
    .update(profiles)
    .set(allowedFields)
    .where(eq(profiles.id, id))
    .returning();

  if (updated.length === 0) {
    return c.json({ error: "Profile not found" }, 404);
  }

  return c.json(updated[0]);
});

// ID verification is disabled: the previous implementation trusted a client
// supplied URL and a stub that always returned true. Re-enable only with real
// server-side document handling and human review.
profilesApp.post("/:id/verify", async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");

  if (id !== userId && !isAdmin(c.get("userRole"))) {
    return c.json({ error: "Forbidden" }, 403);
  }

  return c.json(
    { error: "ID card verification is temporarily unavailable" },
    501
  );
});

export default profilesApp;
