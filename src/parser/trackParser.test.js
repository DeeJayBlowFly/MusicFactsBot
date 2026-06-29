const test = require("node:test");
const assert = require("node:assert");

const { parseTrack } = require("./trackParser");

test("Parse simple track", () => {
  const result = parseTrack("ABBA - Dancing Queen");

  assert.deepEqual(result.artists, ["ABBA"]);
  assert.equal(result.title, "Dancing Queen");
  assert.equal(result.version, null);
  assert.deepEqual(result.featuring, []);
});

test("Parse version", () => {
  const result = parseTrack("ABBA - Dancing Queen (Extended Version)");

  assert.deepEqual(result.artists, ["ABBA"]);
  assert.equal(result.title, "Dancing Queen");
  assert.equal(result.version, "Extended Version");
  assert.deepEqual(result.featuring, []);
});
test("parse: featuring artist", () => {
  const result = parseTrack(
    "Boney M. feat. Bobby Farrell - Sunny '98'"
  );

  assert.deepEqual(result.artists, ["Boney M."]);
  assert.deepEqual(result.featuring, ["Bobby Farrell"]);
  assert.equal(result.title, "Sunny '98'");
});