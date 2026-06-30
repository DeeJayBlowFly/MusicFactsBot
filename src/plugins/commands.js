const fp = require("fastify-plugin");

async function commandsPlugin(fastify) {
  fastify.decorate("commands", new Map());

  fastify.decorate("registerCommand", (name, handler) => {
    fastify.commands.set(name.toLowerCase(), handler);
  });

  fastify.decorate("executeCommand", async (name, context) => {
    const cmd = fastify.commands.get(name.toLowerCase());

    if (!cmd) return false;

    await cmd(context);

    return true;
  });
}

module.exports = fp(commandsPlugin);