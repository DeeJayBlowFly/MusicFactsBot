const { validateFact } = require("../utils/validateFact");
const { ask } = require("./openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");

const cache = require("../cache");
const { createCacheKey } = require("../cache/cacheKeys");

async function getFact(track, lang = "en") {
  const key = createCacheKey(track, lang);

  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const language = getLanguage(lang);
  const prompt = buildPrompt(track, language);

  const fact = validateFact(await ask(prompt));

  cache.set(key, fact);

  return fact;
}

module.exports = {
  getFact,
};