const { getRecording } = require("../providers/musicbrainz");
const { getRelease } = require("../providers/discogs");
const { getArticle } = require("../providers/wikipedia");

const { validateFact } = require("../utils/validateFact");
const { ask } = require("./openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");
const { parseTrack } = require("../utils/trackParser");

const cache = require("../cache");
const { createCacheKey } = require("../cache/cacheKeys");
const history = require("../cache/factHistory");

const pending = new Map();

async function generateFact(track, language) {
  const parsed = parseTrack(track);

  const musicbrainz = await getRecording(parsed.artist, parsed.title);
  const discogs = await getRelease(parsed.artist, parsed.title);
  const wikipedia = await getArticle(parsed.artist, parsed.title);

  let attempts = 0;

  while (attempts < 3) {
    attempts++;

    const prompt = buildPrompt({
      track,
      language,
      musicbrainz,
      discogs,
      wikipedia,
    });

    const fact = validateFact(await ask(prompt));

    if (!history.has(track, fact)) {
      history.add(track, fact);
      return fact;
    }
  }

  const previous = history.get(track);

  return previous.length ? previous[previous.length - 1] : null;
}

async function getFact(track, lang = "de") {
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

      if (fact) {
        cache.set(key, fact);
      }

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