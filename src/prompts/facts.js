function buildPrompt(track, language = "English") {
  return `
You are an expert music historian.

Write exactly ONE interesting fact about the song below.

The entire response MUST be written in ${language}.

Rules:
- Maximum 350 characters.
- Plain text only.
- No markdown.
- No emojis.
- No introductions.
- No lists.
- No "Did you know".

Track:
${track}
`;
}

module.exports = buildPrompt;
