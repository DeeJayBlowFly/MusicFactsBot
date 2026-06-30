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

async function ask(prompt) {
  const response = await retry(() =>
    getClient().responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: prompt,
      max_output_tokens: 400,
      reasoning: {
        effort: "minimal",
      },
    })
  );

  console.log("\n========== OPENAI RESPONSE ==========");
  console.dir(response, { depth: null });
  console.log("=====================================\n");

  if (
    typeof response.output_text === "string" &&
    response.output_text.trim().length > 0
  ) {
    return response.output_text.trim();
  }

  if (Array.isArray(response.output)) {
    const parts = [];

    for (const item of response.output) {
      if (!Array.isArray(item.content)) continue;

      for (const content of item.content) {
        if (
          (content.type === "output_text" || content.type === "text") &&
          content.text
        ) {
          parts.push(content.text);
        }
      }
    }

    const text = parts.join("\n").trim();

    if (text) {
      return text;
    }
  }

  throw new Error("OpenAI returned no text.");
}

module.exports = {
  ask,
};