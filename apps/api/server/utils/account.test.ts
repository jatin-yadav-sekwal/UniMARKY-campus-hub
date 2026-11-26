import test from "node:test";
import assert from "node:assert/strict";
import { chooseSuccessor } from "./account";

const members = [
  { userId: "owner", role: "member" },
  { userId: "normal", role: "member" },
  { userId: "mod", role: "moderator" },
];

test("prefers a moderator over a normal member", () => {
  assert.equal(chooseSuccessor(members, "owner")?.userId, "mod");
});

test("never returns the departing user", () => {
  const onlyOwner = [{ userId: "owner", role: "moderator" }];
  assert.equal(chooseSuccessor(onlyOwner, "owner"), undefined);
});

test("falls back to a normal member when no moderator is left", () => {
  const noMod = [
    { userId: "owner", role: "moderator" },
    { userId: "normal", role: "member" },
  ];
  assert.equal(chooseSuccessor(noMod, "owner")?.userId, "normal");
});
