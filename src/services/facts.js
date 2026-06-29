const { ask } = require("./openai");
const buildPrompt = require("../prompts/facts");
const { getLanguage } = require("../utils/language");

async function getFact(track, lang = "en") {
  const language = getLanguage(lang);

  const prompt = buildPrompt(track, language);

  return ask(prompt);
}

module.exports = {
  getFact,
};