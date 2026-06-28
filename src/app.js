const Fastify = require("fastify");
const cors = require("@fastify/cors");
const sensible = require("@fastify/sensible");

async function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty"
      }
    }
  });

  await app.register(cors);
  await app.register(sensible);

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "MusicFactsBot",
      version: "2.0.0"
    };
  });

  app.get("/version", async () => {
    return {
      version: "2.0.0"
    };
  });

  return app;
}

module.exports = buildApp;