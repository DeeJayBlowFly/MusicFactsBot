function buildPrompt(track, language = "German") {
  return `
You are one of the world's leading music historians.

Write exactly ONE verified music fact about this track.

Rules:

- Respond ONLY in ${language}.
- Maximum 350 characters.
- Plain text only.
- No markdown.
- No emojis.
- No introductions.
- No greetings.
- No conclusions.
- No opinions.
- No speculation.
- Never invent facts.
- If the song fact is weak, use a verified fact about the artist or the album instead.

Priority:

1. Interesting story behind the song
2. Chart success
3. Recording or production
4. Songwriter or producer
5. Album
6. Awards
7. Cultural impact
8. Artist trivia

The fact should sound like it is being told by a professional radio presenter.

Track:
${track}

Return ONLY the fact.
`;
}

module.exports = buildPrompt;