import test from "node:test";
import assert from "node:assert/strict";
import { Hono } from "hono";
import { rateLimit } from "./rateLimit";

let keySeed = 0;

function makeApp(max: number, windowMs = 60_000) {
  const app = new Hono();
  app.use(
    "*",
    rateLimit({ windowMs, max, keyPrefix: `test-${keySeed++}` })
  );
  app.get("/", (c) => c.text("ok"));
  return app;
}

test("allows up to max requests, then returns 429 with Retry-After", async () => {
  const app = makeApp(2);
  const headers = { "x-forwarded-for": "203.0.113.10" };

  assert.equal((await app.request("/", { headers })).status, 200);
  assert.equal((await app.request("/", { headers })).status, 200);

  const blocked = await app.request("/", { headers });
  assert.equal(blocked.status, 429);
  assert.ok(Number(blocked.headers.get("retry-after")) >= 1);
});

test("different IPs get separate buckets", async () => {
  const app = makeApp(1);

  const first = await app.request("/", {
    headers: { "x-forwarded-for": "203.0.113.11" },
  });
  const second = await app.request("/", {
    headers: { "x-forwarded-for": "203.0.113.12" },
  });

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
});

test("the window resets after it expires", async () => {
  const app = makeApp(1, 25);
  const headers = { "x-forwarded-for": "203.0.113.13" };

  assert.equal((await app.request("/", { headers })).status, 200);
  assert.equal((await app.request("/", { headers })).status, 429);

  await new Promise((resolve) => setTimeout(resolve, 40));

  assert.equal((await app.request("/", { headers })).status, 200);
});
