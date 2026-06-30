const fp = require("fastify-plugin");

let currentTrack = null;

async function nowPlayingPlugin(fastify) {
  fastify.decorate("nowPlaying", {
    get() {
      return currentTrack;
    },

    set(track) {
      currentTrack = track;
      fastify.log.info(`Now Playing: ${track}`);
    },

    clear() {
      currentTrack = null;
    },
  });
}

module.exports = fp(nowPlayingPlugin);