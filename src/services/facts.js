const { getRecording } = require("../providers/musicbrainz");
const { getRelease } = require("../providers/discogs");
const { getArticle } = require("../providers/wikipedia");

const { validateFact } = require("../utils/validateFact");
const { ask } = require("../openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");
const { parseTrack } = require("../utils/trackParser");

const cache = require("../cache");
const { createCacheKey } = require("../cache/cacheKeys");
const history = require("../cache/factHistory");

const pending = new Map();

async function createNewFact(track, language) {
  const parsed = parseTrack(track);

  const [musicbrainz, discogs, wikipedia] = await Promise.all([
    getRecording(parsed.artist, parsed.title),
    getRelease(parsed.artist, parsed.title),
    getArticle(parsed.artist, parsed.title),
  ]);

  for (let attempt = 0; attempt < 5; attempt++) {
    const previousFacts = history.get(track);

    const prompt = buildPrompt({
      track,
      language,
      musicbrainz,
      discogs,
      wikipedia,
      previousFacts,
    });

    const fact = validateFact(await ask(prompt));

    if (!history.has(track, fact)) {
      history.add(track, fact);
      return fact;
    }
  }

  const previous = history.get(track);

  return previous.length
    ? previous[Math.floor(Math.random() * previous.length)]
    : null;
}

async function getFact(track, lang = "de") {
  const key = createCacheKey(track, lang);

  if (pending.has(key)) {
    return pending.get(key);
  }

  const promise = (async () => {
    try {
      const language = getLanguage(lang);

      // Brug cache kun første gang
      if (!history.count(track)) {
        const cached = cache.get(key);

        if (cached) {
          history.add(track, cached);
          return cached;
        }
      }

      const fact = await createNewFact(track, language);

      if (fact && !cache.get(key)) {
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