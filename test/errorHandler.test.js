const { test } = require("node:test");
const assert = require("node:assert");

const buildApp = require("../src/app");

test("Unknown route returns 404 JSON", async () => {
  const app = await buildApp();

  const res = await app.inject({
    method: "GET",
    url: "/does-not-exist",
  });

  assert.equal(res.statusCode, 404);

  const body = JSON.parse(res.payload);

  assert.equal(body.error, "Not Found");

  await app.close();
});