const Disconnect = require("disconnect").Client;

const db = new Disconnect({
  userToken: process.env.DISCOGS_TOKEN,
}).database();

async function getRelease(artist, title) {
  try {
    const result = await db.search({
      artist,
      track: title,
      type: "release",
      per_page: 1,
    });

    if (!result.results || result.results.length === 0) {
      return null;
    }

    const release = result.results[0];

    return {
      artist,
      title,
      year: release.year || "",
      label: release.label?.[0] || "",
      format: release.format?.join(", ") || "",
      country: release.country || "",
      genre: release.genre?.join(", ") || "",
      style: release.style?.join(", ") || "",
      source: "discogs",
    };
  } catch (err) {
    console.error("Discogs:", err.message);
    return null;
  }
}

module.exports = {
  getRelease,
};