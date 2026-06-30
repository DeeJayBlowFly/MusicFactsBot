const fp = require("fastify-plugin");
const tmi = require("tmi.js");

const { getFact } = require("../services/facts");
const trackCache = require("../cache/trackCache");

const NOW_PLAYING_PREFIX = "Now Playing:";
const FACT_DELAY = Number(process.env.FACT_DELAY || 500);
const FACT_LANGUAGE = process.env.FACT_LANGUAGE || "de";

async function twitchPlugin(fastify) {
  // Skip Twitch completely during tests or when credentials are missing
  if (
    !process.env.TWITCH_USER ||
    !process.env.TWITCH_AUTH ||
    !process.env.CHANNELS
  ) {
    fastify.log.warn("Twitch plugin disabled (missing environment variables).");
    return;
  }

  const client = new tmi.Client({
    options: {
      debug: true,
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: process.env.TWITCH_USER,
      password: process.env.TWITCH_AUTH,
    },
    channels: process.env.CHANNELS
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
  });

  let timer = null;

  client.on("connected", () => {
    fastify.log.info("Twitch bot connected");
  });

  client.on("disconnected", (reason) => {
    fastify.log.warn(`Twitch disconnected: ${reason}`);
  });

  client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    // Kun lyt til BlowFlyMusicBot
    if (tags.username?.toLowerCase() !== "blowflymusicbot") {
      return;
    }

    if (!message.startsWith(NOW_PLAYING_PREFIX)) {
      return;
    }

    const track = message
      .replace(NOW_PLAYING_PREFIX, "")
      .replace(/"/g, "")
      .replace(/\.$/, "")
      .trim();

    if (!track) return;

    if (trackCache.isDuplicate(track)) {
      fastify.log.info(`Duplicate ignored: ${track}`);
      return;
    }

    fastify.log.info(`Now Playing: ${track}`);

    fastify.nowPlaying.set(track);

    clearTimeout(timer);

    // Start OpenAI med det samme
    const factPromise = getFact(track, FACT_LANGUAGE);

    timer = setTimeout(async () => {
      try {
        const fact = await factPromise;

        if (!fact) return;

        await client.say(channel, fact);

        fastify.log.info("Music fact sent");
      } catch (err) {
        fastify.log.error(err);
      }
    }, FACT_DELAY);
  });

  await client.connect();

  fastify.decorate("twitch", client);
}

module.exports = fp(twitchPlugin);