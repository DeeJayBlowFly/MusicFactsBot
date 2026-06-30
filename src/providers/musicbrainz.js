const USER_AGENT = "AI-DeeJayBlowFly/1.1.0";

async function getRecording(artist, title) {
  try {
    const query = encodeURIComponent(
      `artist:"${artist}" AND recording:"${title}"`
    );

    const response = await fetch(
      `https://musicbrainz.org/ws/2/recording?query=${query}&fmt=json&limit=1`,
      {
        headers: {
          "User-Agent": USER_AGENT,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (!data.recordings?.length) {
      return null;
    }

    const recording = data.recordings[0];

    return {
      artist,
      title,
      album: recording.releases?.[0]?.title || "",
      year: recording["first-release-date"]?.substring(0, 4) || "",
      release: recording.releases?.[0]?.title || "",
      source: "musicbrainz",
    };
  } catch (err) {
    console.error("MusicBrainz:", err.message);
    return null;
  }
}

module.exports = {
  getRecording,
};