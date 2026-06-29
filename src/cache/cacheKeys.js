function createCacheKey(track, lang = "en") {
  return `${lang}:${track}`.toLowerCase().trim();
}

module.exports = {
  createCacheKey,
};
