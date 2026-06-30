const { MusicBrainzApi } = require("musicbrainz-api");

const client = new MusicBrainzApi({
  appName: "AI-DeeJayBlowFly",
  appVersion: "1.1.0",
  appContactInfo: "https://github.com/DeeJayBlowFly/AI-DeeJayBlowFly",
});

async function getRecording(artist, title) {
  try {
    const query = `artist:"${artist}" AND recording:"${title}"`;

    const result = await client.searchRecordings({
      query,
      limit: 1,
    });

    if (!result.recordings?.length) {
      return null;
    }

    const recording = result.recordings[0];

    return {
      artist,
      title,
      album: recording.releases?.[0]?.title || "",
      year: recording.releases?.[0]?.date?.substring(0, 4) || "",
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