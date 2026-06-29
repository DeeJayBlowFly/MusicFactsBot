const { test } = require("node:test");
const assert = require("node:assert");
const buildApp = require("../src/app");

test("Rate limiter blocks excessive requests", async () => {
  process.env.RATE_LIMIT_MAX = "3";

  const app = await buildApp();

  for (let i = 0; i < 3; i++) {
    const res = await app.inject({
      method: "GET",
      url: "/health",
    });

    assert.equal(res.statusCode, 200);
  }

  const blocked = await app.inject({
    method: "GET",
    url: "/health",
  });

  assert.equal(blocked.statusCode, 429);

  await app.close();

  delete process.env.RATE_LIMIT_MAX;
});