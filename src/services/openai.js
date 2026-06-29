const OpenAI = require("openai");
const { retry } = require("../utils/retry");

let client;

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return client;
}

async function ask(input) {
  const response = await retry(() =>
    getClient().responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input,
      timeout: 30000,
    })
  );

  return response.output_text.trim();
}

module.exports = {
  ask,
};