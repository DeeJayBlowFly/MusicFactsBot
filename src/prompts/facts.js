const { parseTrack } = require("../utils/trackParser");

function buildPrompt(data) {
  const language = data.language || "German";
  const parsed = parseTrack(data.track);

  const mb = data.musicbrainz || {};
  const discogs = data.discogs || {};
  const wiki = data.wikipedia || {};

  return `
You are a professional music historian.

Write ONE interesting and VERIFIED music fact.

Rules:

- Respond ONLY in ${language}
- Maximum 350 characters
- Plain text only
- No markdown
- No emojis
- No introductions
- No conclusions
- Never invent facts
- If metadata is available, always use it
- If several facts are available, choose the most interesting one
- If song information is limited, use artist information

Track

Artist:
${parsed.artist}

Title:
${parsed.title}

MusicBrainz

Album:
${mb.album || ""}

Year:
${mb.year || ""}

Release:
${mb.release || ""}

Discogs

Label:
${discogs.label || ""}

Format:
${discogs.format || ""}

Genre:
${discogs.genre || ""}

Style:
${discogs.style || ""}

Country:
${discogs.country || ""}

Wikipedia

${wiki.summary || ""}

Return ONLY the finished fact.
`;
}

module.exports = buildPrompt;