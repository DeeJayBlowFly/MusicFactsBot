const wiki = require("wikijs").default;

const wikipedia = wiki({
  apiUrl: "https://de.wikipedia.org/w/api.php",
});

function clean(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\([^)]*\)/g, "")
    .replace(/\[[^\]]*]/g, "")
    .trim();
}

function shorten(text, max = 500) {
  if (!text || text.length <= max) {
    return text;
  }

  const cut = text.lastIndexOf(".", max);

  if (cut > 100) {
    return text.substring(0, cut + 1);
  }

  return text.substring(0, max) + "...";
}

async function tryPage(query) {
  try {
    return await wikipedia.page(query);
  } catch {
    return null;
  }
}

async function getArticle(artist, title) {
  const queries = [
    `${title} (${artist} song)`,
    `${artist} ${title}`,
    `${title} song`,
    `${title}`,
    artist,
  ];

  for (const query of queries) {
    const page = await tryPage(query);

    if (!page) {
      continue;
    }

    let summary = "";

    try {
      summary = await page.summary();
    } catch {
      continue;
    }

    summary = shorten(clean(summary));

    if (!summary) {
      continue;
    }

    return {
      artist,
      title,
      summary,
      source: "wikipedia",
    };
  }

  return null;
}

module.exports = {
  getArticle,
};