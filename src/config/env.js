const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const localEnv = path.resolve(process.cwd(), ".env");

const userEnv = process.env.APPDATA
  ? path.join(process.env.APPDATA, "AI-DeeJayBlowFly", "config.env")
  : null;

if (userEnv && fs.existsSync(userEnv)) {
  dotenv.config({
    path: userEnv,
    override: true,
  });
} else {
  dotenv.config({
    path: localEnv,
  });
}

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

module.exports = {
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