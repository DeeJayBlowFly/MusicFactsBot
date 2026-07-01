const fp = require("fastify-plugin");
const tmi = require("tmi.js");

const { getFact } = require("../services/facts");
const trackCache = require("../cache/trackCache");
const dashboard = require("../dashboard/state");
let botRunning = true;

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
    if (!botRunning || !dashboard.running) {
  return;
}

    const username = tags.username?.toLowerCase();

// Tillad !testfact fra broadcaster/mod
if (
  message.toLowerCase().startsWith("!testfact ") &&
  (tags.badges?.broadcaster || tags.mod)
) {
  // fortsæt
} else if (username !== "blowflymusicbot") {
  return;
}

    // Testkommando
if (message.toLowerCase().startsWith("!testfact ")) {
  try {
    const track = message.substring(10).trim();

    if (!track) {
      await client.say(channel, "Brug: !testfact Artist - Titel");
      return;
    }

    fastify.log.info(`TestFact: ${track}`);

    const fact = await getFact(track, FACT_LANGUAGE);

    if (fact) {
      await client.say(channel, fact);
    }

    return;
  } catch (err) {
    fastify.log.error(err);
    return;
  }
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
    dashboard.track = track;
    dashboard.uniqueSongs.add(track);

    clearTimeout(timer);

    // Start OpenAI med det samme
    const factPromise = getFact(track, FACT_LANGUAGE);

    timer = setTimeout(async () => {
      try {
        const fact = await factPromise;

        if (!fact) return;

        await client.say(channel, fact);
        dashboard.fact = fact;
        dashboard.factsSent++;

        fastify.log.info("Music fact sent");
      } catch (err) {
        fastify.log.error(err);
      }
    }, FACT_DELAY);
  });

  await client.connect();

  fastify.decorate("twitch", client);
}
fp.startBot = () => {
  botRunning = true;
  dashboard.running = true;
  dashboard.addLog("Bot started from Desktop.");
};

fp.stopBot = () => {
  botRunning = false;
  dashboard.running = false;
  dashboard.addLog("Bot stopped from Desktop.");
};
module.exports = fp(twitchPlugin);