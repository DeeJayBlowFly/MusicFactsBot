require("dotenv").config();

const buildApp = require("./app");

async function start(options = {}) {
  const app = await buildApp();

  if (!options.embedded) {
    const port = process.env.PORT || 3000;

    await app.listen({
      port,
      host: "0.0.0.0"
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