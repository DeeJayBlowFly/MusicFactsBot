const fp = require("fastify-plugin");
const path = require("path");
const state = require("./state");
const { getFact } = require("../services/facts");

async function dashboardPlugin(fastify) {

  await fastify.register(require("@fastify/static"), {
    root: path.join(process.cwd(), "public"),
    prefix: "/",
  });

  fastify.get("/api/dashboard", async () => ({
    running: state.running,
    track: state.track,
    fact: state.fact,
    factsSent: state.factsSent,
    uniqueSongs: state.uniqueSongs.size,
    cacheHits: state.cacheHits,
    responseTime: state.lastResponseTime,
    reconnects: state.reconnects,
    uptime: state.uptime(),
    status: state.status,
    logs: state.logs,
  }));

  fastify.post("/api/start", async () => {

  state.running = true;

  if (fastify.twitch?.startBot) {
    fastify.twitch.startBot();
  }

  state.addLog("Bot started.");

  return {
    success: true
  };

});

  fastify.post("/api/stop", async () => {

  state.running = false;

  if (fastify.twitch?.stopBot) {
    fastify.twitch.stopBot();
  }

  state.addLog("Bot stopped.", "WARN");

  return {
    success: true
  };

});

  fastify.post("/api/testfact", async (request) => {

    try {

      const { track } = request.body || {};

      if (!track) {
        state.addLog("Missing track.", "ERROR");

        return {
          success: false,
          message: "Missing track"
        };
      }

      state.addLog(`Testing "${track}"`);

      const started = Date.now();

      const fact = await getFact(
        track,
        process.env.FACT_LANGUAGE || "de"
      );

      state.setResponseTime(Date.now() - started);

      state.track = track;
      state.fact = fact;
      state.factsSent++;
      state.uniqueSongs.add(track);

      state.setStatus("openai", true);
      state.setStatus("musicbrainz", true);
      state.setStatus("discogs", true);
      state.setStatus("wikipedia", true);

      state.addLog(
        `Fact generated in ${state.lastResponseTime} ms`
      );

      return {
        success: true,
        fact,
      };

    } catch (err) {

      state.setStatus("openai", false);

      state.addLog(err.message, "ERROR");

      return {
        success: false,
        error: err.message,
      };

    }

  });

}

module.exports = fp(dashboardPlugin);