/**
 * Pick who inherits a community when its creator deletes their account.
 * Moderators win over normal members; the departing user is never chosen.
 */
export function chooseSuccessor<T extends { userId: string; role: string }>(
  members: T[],
  userId: string
): T | undefined {
  return members
    .filter((member) => member.userId !== userId)
    .sort(
      (a, b) =>
        (a.role === "moderator" ? -1 : 1) - (b.role === "moderator" ? -1 : 1)
    )[0];
}
