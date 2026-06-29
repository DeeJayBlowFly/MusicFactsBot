const test = require("node:test");
const assert = require("node:assert");

const cache = require("./memoryCache");

test("cache: set and get", () => {
  cache.clear();

  cache.set("test", "value");

  assert.equal(cache.get("test"), "value");
});

test("cache: missing key", () => {
  cache.clear();

  assert.equal(cache.get("missing"), null);
});

test("cache: has()", () => {
  cache.clear();

  cache.set("hello", "world");

  assert.equal(cache.has("hello"), true);
  assert.equal(cache.has("unknown"), false);
});

test("cache: remove()", () => {
  cache.clear();

  cache.set("a", 123);

  cache.remove("a");

  assert.equal(cache.get("a"), null);
});

test("cache: clear()", () => {
  cache.clear();

  cache.set("a", 1);
  cache.set("b", 2);

  cache.clear();

  assert.equal(cache.stats().entries, 0);
});

test("cache: ttl expires", async () => {
  cache.clear();

  cache.set("ttl", "value", 100);

  await new Promise((resolve) => setTimeout(resolve, 150));

  assert.equal(cache.get("ttl"), null);
});
