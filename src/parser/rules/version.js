function extractVersion(data) {
  const match = data.title.match(/\(([^)]+)\)$/);

  if (!match) {
    return data;
  }

  data.version = match[1].trim();
  data.title = data.title.replace(/\s*\([^)]+\)$/, "").trim();

  return data;
}

module.exports = {
  extractVersion,
};