const test = require("node:test");
const assert = require("node:assert");

const { validateFact } = require("./validateFact");

test("validate: accepts valid fact", () => {
  const fact = "ABBA won the Eurovision Song Contest in 1974.";

  assert.equal(validateFact(fact), fact);
});

test("validate: trims whitespace", () => {
  assert.equal(validateFact("  Hello  "), "Hello");
});

test("validate: rejects empty string", () => {
  assert.throws(() => validateFact("   "));
});

test("validate: rejects null", () => {
  assert.throws(() => validateFact(null));
});

test("validate: truncates long responses", () => {
  const long = "A".repeat(400);

  const result = validateFact(long);

  assert.equal(result.length, 350);
  assert.ok(result.endsWith("..."));
});