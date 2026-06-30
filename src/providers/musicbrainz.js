const { MusicBrainzApi } = require("musicbrainz-api");

const api = new MusicBrainzApi({
  appName: "AI-DeeJayBlowFly",
  appVersion: "1.1.0",
  appContactInfo: "https://github.com/DeeJayBlowFly/AI-DeeJayBlowFly",
});

async function searchRecording(query) {
  const result = await api.searchRecording(query, 5);

  if (!result.recordings?.length) {
    return null;
  }

  return result.recordings[0];
}

module.exports = {
  searchRecording,
};