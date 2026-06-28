const Fastify = require("fastify");
const cors = require("@fastify/cors");
const sensible = require("@fastify/sensible");

const healthRoutes = require("./routes/health");
const versionRoutes = require("./routes/version");
const factsRoutes = require("./routes/facts");

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

  await app.register(healthRoutes);
  await app.register(versionRoutes);
  await app.register(factsRoutes);

  return app;
}

module.exports = buildApp;