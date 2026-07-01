const { parseTrack } = require("../utils/trackParser");
const { randomTopic } = require("../utils/factTopics");

function buildPrompt(data) {
  const language = data.language || "German";
  const parsed = parseTrack(data.track);

  const mb = data.musicbrainz || {};
  const discogs = data.discogs || {};
  const wiki = data.wikipedia || {};

  const previousFacts = (data.previousFacts || []).join("\n- ");

  const topic = randomTopic();

  return `
You are an experienced music journalist.

Write ONE verified and interesting music fact.

Language:
${language}

Today's topic:
${topic}

Rules:

- Maximum 350 characters.
- Plain text only.
- No markdown.
- No emojis.
- Never invent facts.
- Do NOT repeat any previous fact.
- Prefer surprising or little-known information.
- Avoid generic phrases like "was a successful hit".
- If information for today's topic is unavailable, choose the next best verified fact.

Previous facts:
- ${previousFacts || "None"}

Artist:
${parsed.artist}

Song:
${parsed.title}

Album:
${mb.album || ""}

Year:
${mb.year || ""}

Release:
${mb.release || ""}

Label:
${discogs.label || ""}

Genre:
${discogs.genre || ""}

Style:
${discogs.style || ""}

Country:
${discogs.country || ""}

Background:
${wiki.summary || ""}

Return ONLY the finished fact.
`;
}

module.exports = buildPrompt;