import type { InferSelectModel } from "drizzle-orm";
import type { profiles } from "../db/schema";

type Profile = Pick<
  InferSelectModel<typeof profiles>,
  "onboardingCompleted" | "universityName"
>;

/**
 * Decide whether a user has finished onboarding.
 *
 * The explicit flag is authoritative when set. Legacy rows created before
 * onboarding existed only carry a university name — those users must not be
 * pushed back through the flow.
 */
export function isOnboarded(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  if (profile.onboardingCompleted === true) return true;
  return Boolean(profile.universityName);
}
