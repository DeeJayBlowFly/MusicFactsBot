function buildPrompt(track, language = "English") {
  return `
You are a professional music historian and music metadata expert.

Your task is to provide exactly ONE accurate and verifiable fact about the song.

Requirements:
- Respond ONLY in ${language}.
- Maximum 350 characters.
- Plain text only.
- No markdown.
- No emojis.
- No bullet points.
- No introductions.
- No conclusions.
- No speculation.
- If uncertain, choose the best-known verified fact.
- Prefer facts about:
  • release
  • chart performance
  • songwriter
  • producer
  • album
  • recording
  • awards
  • cultural significance

Track:
${track}

Return ONLY the fact.
`;
}

module.exports = buildPrompt;