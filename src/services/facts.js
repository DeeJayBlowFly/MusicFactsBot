const { validateFact } = require("../utils/validateFact");
const { ask } = require("./openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");

const cache = require("../cache");
const { createCacheKey } = require("../cache/cacheKeys");

const pending = new Map();

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

      const prompt = buildPrompt(track, language);

      const fact = validateFact(await ask(prompt));

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