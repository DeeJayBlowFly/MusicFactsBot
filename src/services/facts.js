const { searchRecording } = require("../providers/musicbrainz");
const { validateFact } = require("../utils/validateFact");
const { ask } = require("./openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");

const cache = require("../cache");
const { createCacheKey } = require("../cache/cacheKeys");
const history = require("../cache/factHistory");

const pending = new Map();

async function generateFact(track, language) {
  let attempts = 0;

  while (attempts < 3) {
    attempts++;

    const prompt = buildPrompt(track, language);

    const fact = validateFact(await ask(prompt));

    if (!history.has(track, fact)) {
      history.add(track, fact);
      return fact;
    }
  }

  return history.get(track).at(-1);
}

async function getFact(track, lang = "en") {
  const key = createCacheKey(track, lang);

  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  if (pending.has(key)) {
    return pending.get(key);
  }

  const promise = (async () => {
    try {
      const language = getLanguage(lang);

      const fact = await generateFact(track, language);

      cache.set(key, fact);

      return fact;
    } finally {
      pending.delete(key);
    }
  })();

  pending.set(key, promise);

  return promise;
}

module.exports = {
  getFact,
};