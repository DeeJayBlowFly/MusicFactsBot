const ask = require("./openai").ask;
const buildPrompt = require("../prompts/facts");

async function getFact(track, lang) {

  const prompt = buildPrompt(track, lang);

  return await ask(prompt);

}

module.exports = {
  getFact
};