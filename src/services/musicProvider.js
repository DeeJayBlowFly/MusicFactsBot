const { MusicBrainzApi } = require("musicbrainz-api");

const mbApi = new MusicBrainzApi({
  appName: "AI-DeeJayBlowFly",
  appVersion: "1.0.0",
  appContactInfo: "https://github.com/DeeJayBlowFly/AI-DeeJayBlowFly",
});

class MusicProvider {
  async getTrackData(track) {
    try {
      const result = await mbApi.searchRecording(track, 1);

      if (!result.recordings || result.recordings.length === 0) {
        return null;
      }

      const recording = result.recordings[0];

      return {
        title: recording.title,
        artist:
          recording["artist-credit"]?.map((a) => a.name).join(", ") || "",
        release:
          recording.releases?.[0]?.title || "",
        year:
          recording.releases?.[0]?.date?.substring(0, 4) || "",
        source: "MusicBrainz",
      };
    } catch (err) {
      console.error("MusicBrainz:", err.message);
      return null;
    }
  }
}

module.exports = new MusicProvider();