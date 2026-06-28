const OpenAI = require("openai");
const config = require("../config/env");

const client = new OpenAI({
  apiKey: config.openai.apiKey
});

async function ask(prompt) {
  try {
    const response = await client.responses.create({
      model: config.openai.model,
      input: prompt
    });

    return response.output_text.trim();

  } catch (err) {

    console.error(err);

    return "No music facts available.";
  }
}

module.exports = {
  ask
};