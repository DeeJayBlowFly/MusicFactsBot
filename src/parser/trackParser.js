const { extractVersion } = require("./rules/version");
const { extractFeaturing } = require("./rules/featuring");
const { extractArtists } = require("./rules/artists");
const { extractRemix } = require("./rules/remix");

function parseTrack(track) {
  if (!track || typeof track !== "string") {
    throw new Error("Invalid track");
  }

  const parts = track.split(/\s+-\s+/);

  if (parts.length < 2) {
    throw new Error("Unable to parse track");
  }

  let data = {
    artists: [parts.shift().trim()],
    title: parts.join(" - ").trim(),
    version: null,
    featuring: [],
  };

  data = extractArtists(data);
  data = extractFeaturing(data);
  data = extractVersion(data);
  data = extractRemix(data);

  return data;
}

module.exports = {
  parseTrack,
};
