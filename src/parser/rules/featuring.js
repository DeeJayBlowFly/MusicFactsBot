function extractFeaturing(data) {
  const regex =
    /\s+(?:feat\.?|ft\.?|featuring)\s+/i;

  const match = data.artists[0].match(regex);

  if (!match) {
    return data;
  }

  const parts = data.artists[0].split(regex);

  data.artists = [parts[0].trim()];
  data.featuring = [parts[1].trim()];

  return data;
}

module.exports = {
  extractFeaturing,
};