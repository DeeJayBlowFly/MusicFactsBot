"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify) {
  await fastify.register(require("@fastify/swagger"), {
    openapi: {
      info: {
        title: "MusicFactsBot API",
        description: "Music facts for Twitch bots",
        version: "1.0.0"
      },
      servers: [
        {
          url: "/"
        }
      ],
      tags: [
        {
          name: "Facts",
          description: "Music facts"
        }
      ]
    }
  });

  await fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false
    }
  });
});