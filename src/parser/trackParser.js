function parseTrack(track) {
  if (!track || typeof track !== "string") {
    throw new Error("Invalid track");
  }

  const parts = track.split(/\s+-\s+/);

  if (parts.length < 2) {
    throw new Error("Unable to parse track");
  }

  const artist = parts.shift().trim();
  const title = parts.join(" - ").trim();

  return {
    artists: [artist],
    title,
    version: null,
    featuring: [],
  };
}

module.exports = {
  parseTrack,
};