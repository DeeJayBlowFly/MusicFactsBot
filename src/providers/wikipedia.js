const wiki = require("wikijs").default;

async function getArticle(artist, title) {
  const queries = [
    `${artist} ${title}`,
    `${title} (${artist} song)`,
    `${title} song`,
    `${artist}`,
  ];

  for (const query of queries) {
    try {
      const page = await wiki().page(query);

      return {
        artist,
        title,
        summary: (await page.summary()).replace(/\s+/g, " ").trim(),
        url: page.raw.fullurl,
        source: "wikipedia",
      };
    } catch {
      // prøv næste søgning
    }
  }

  return null;
}

module.exports = {
  getArticle,
};