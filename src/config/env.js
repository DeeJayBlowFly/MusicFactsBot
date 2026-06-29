require("dotenv").config();

function getEnv(name, fallback) {
  const value = process.env[name];

  if (value && value.trim() !== "") {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  throw new Error(`Missing environment variable: ${name}`);
}

const config = {
  app: {
    name: "MusicFactsBot",
    version: "2.0.0",
    port: Number(getEnv("PORT", 3000)),
  },

  openai: {
    apiKey: getEnv("OPENAI_API_KEY"),
    model: getEnv("OPENAI_MODEL", "gpt-5-mini"),
  },
};

module.exports = config;
