function buildPrompt(track, lang) {

  return `
You are a professional music historian.

Write ONE interesting fact about this song.

Song:

${track}

Language:

${lang}

Rules:

Maximum 350 characters.

No lists.

No markdown.

Only the fact.
`;

}

module.exports = buildPrompt;