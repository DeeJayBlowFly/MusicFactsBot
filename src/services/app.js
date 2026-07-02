const Fastify = require("fastify");
const cors = require("@fastify/cors");
const sensible = require("@fastify/sensible");

const swaggerPlugin = require("../plugins/swagger");
const twitchPlugin = require("../plugins/twitch");
const nowPlayingPlugin = require("../plugins/nowPlaying");
const commandsPlugin = require("../plugins/commands");
const errorHandlerPlugin = require("../plugins/errorHandler");
const rateLimitPlugin = require("../plugins/rateLimit");

const dashboardPlugin = require("../dashboard/server");

const healthRoutes = require("../routes/health");
const versionRoutes = require("../routes/version");
const factsRoutes = require("../routes/facts");

async function buildApp() {
  const app = Fastify({
    logger: process.env.NODE_ENV === "production"
  ? true
  : {
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

  await app.register(twitchPlugin);
  await app.register(nowPlayingPlugin);
  await app.register(commandsPlugin);

  await app.register(rateLimitPlugin);
  await app.register(errorHandlerPlugin);

  await app.register(healthRoutes);
  await app.register(versionRoutes);
  await app.register(factsRoutes);

  await app.register(dashboardPlugin);

  return app;
}

module.exports = buildApp;