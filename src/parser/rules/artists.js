function extractArtists(data) {
  const separators = /\s+(?:&|and|x|vs\.)\s+/i;

  if (!separators.test(data.artists[0])) {
    return data;
  }

  data.artists = data.artists[0]
    .split(separators)
    .map((artist) => artist.trim())
    .filter(Boolean);

  return data;
}

module.exports = {
  extractArtists,
};