"use strict";

const fp = require("fastify-plugin");
const rateLimit = require("@fastify/rate-limit");

module.exports = fp(async function (app) {
  await app.register(rateLimit, {
    global: true,

    max: Number(process.env.RATE_LIMIT_MAX ?? 60),

    timeWindow: process.env.RATE_LIMIT_WINDOW ?? "1 minute",

    errorResponseBuilder(request, context) {
      return {
        error: "Too Many Requests",
        statusCode: 429,
        message: `Rate limit exceeded. Try again in ${context.after}.`
      };
    }
  });
});