const rateLimitPlugin = require("./plugins/rateLimit");
const swaggerPlugin = require("./plugins/swagger");
const Fastify = require("fastify");
const cors = require("@fastify/cors");
const sensible = require("@fastify/sensible");

const healthRoutes = require("./routes/health");
const versionRoutes = require("./routes/version");
const factsRoutes = require("./routes/facts");

async function buildApp() {
  const app = Fastify({
    logger: {
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
      colorize: true,
    },
  },
},
  });

  await app.register(cors);
  await app.register(sensible);

  await app.register(swaggerPlugin);
  await app.register(rateLimitPlugin);
  
  await app.register(healthRoutes);
  await app.register(versionRoutes);
  await app.register(factsRoutes);

  return app;
}

module.exports = buildApp;
