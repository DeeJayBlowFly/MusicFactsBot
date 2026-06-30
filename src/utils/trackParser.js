function parseTrack(track) {
  const cleaned = track
    .replace(/\(.*?\)/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleaned.split(/\s[-–—]\s/);

  if (parts.length < 2) {
    return {
      artist: "",
      title: cleaned,
      full: cleaned,
    };
  }

  return {
    artist: parts.shift().trim(),
    title: parts.join(" - ").trim(),
    full: cleaned,
  };
}

module.exports = {
  parseTrack,
};