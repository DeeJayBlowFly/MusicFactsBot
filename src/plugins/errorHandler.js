"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (app) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        error: "Bad Request",
        statusCode: 400,
        message: error.message,
      });
    }

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.name || "Error",
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    return reply.status(500).send({
      error: "Internal Server Error",
      statusCode: 500,
      message: "An unexpected error occurred.",
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: "Not Found",
      statusCode: 404,
      message: `Route ${request.method} ${request.url} not found`,
    });
  });
});