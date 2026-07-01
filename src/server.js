const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const appDataDir = path.join(process.env.APPDATA || process.cwd(), "AI-DeeJayBlowFly");
const appDataEnv = path.join(appDataDir, "config.env");

if (fs.existsSync(appDataEnv)) {
  dotenv.config({ path: appDataEnv });
  console.log("Using config:", appDataEnv);
} else {
  dotenv.config();
  console.log("Using local .env");
}

const buildApp = require("./app");

async function start({
  port = process.env.PORT || 3000,
  host = "127.0.0.1",
  embedded = false,
} = {}) {
  const app = await buildApp();

  if (!embedded) {
    await app.listen({
      port,
      host,
    });

    app.log.info(`AI-DeeJayBlowFly listening on ${port}`);
  }

  return app;
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = start;