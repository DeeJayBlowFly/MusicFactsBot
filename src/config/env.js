require("dotenv").config();

function getEnv(name, fallback = null) {
  const value = process.env[name];

  if (value !== undefined && value !== "") {
    return value;
  }

  if (fallback !== null) {
    return fallback;
  }

  throw new Error(`Missing environment variable: ${name}`);
}

module.exports = {
  port: Number(getEnv("PORT", 3000)),

  openai: {
    apiKey: getEnv("OPENAI_API_KEY"),
    model: getEnv("OPENAI_MODEL", "gpt-5-mini")
  }
};