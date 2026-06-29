const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function ask(input) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5-mini",
    input,
  });

  return response.output_text.trim();
}

module.exports = {
  ask,
};
