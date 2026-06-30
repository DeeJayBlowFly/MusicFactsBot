const { parseTrack } = require("../utils/trackParser");

function buildPrompt(track, language = "German") {
  const parsed = parseTrack(track);

  return `
You are one of the world's leading music historians.

Write exactly ONE verified and interesting fact.

Language:
${language}

Maximum length:
350 characters.

Rules:

- Plain text only.
- No markdown.
- No emojis.
- No greetings.
- No introductions.
- No conclusions.
- No opinions.
- Never invent facts.
- If information about the song is limited, use a verified fact about the artist, album, recording, chart performance or songwriter.

Priority:

1. Story behind the song
2. Chart success
3. Recording or production
4. Songwriter / Producer
5. Album
6. Awards
7. Cultural impact
8. Artist

Artist:
${parsed.artist}

Title:
${parsed.title}

Original input:
${parsed.full}

Return ONLY the fact.
`;
}

module.exports = buildPrompt;