const fp = require("fastify-plugin");
const tmi = require("tmi.js");

const { getFact } = require("../services/facts");
const trackCache = require("../cache/trackCache");

const NOW_PLAYING_PREFIX = "Now Playing:";
const FACT_DELAY = Number(process.env.FACT_DELAY || 500);

async function twitchPlugin(fastify) {
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
    channels: process.env.CHANNELS.split(","),
  });

  let timer = null;

  client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    if (tags.username.toLowerCase() !== "blowflymusicbot") return;

    if (!message.startsWith(NOW_PLAYING_PREFIX)) return;

    const track = message
      .replace(NOW_PLAYING_PREFIX, "")
      .replace(/"/g, "")
      .replace(/\.$/, "")
      .trim();

    if (!track) return;

    if (trackCache.isDuplicate(track)) {
      console.log("Duplicate track ignored:", track);
      return;
    }

    console.log("New track:", track);

    fastify.nowPlaying.set(track);

    const factPromise = getFact(track, process.env.FACT_LANGUAGE || "de");

    clearTimeout(timer);

    timer = setTimeout(async () => {
      try {
        const fact = await factPromise;

        if (fact) {
          await client.say(channel, fact);
          console.log("Fact sent.");
        }
      } catch (err) {
        console.error("MusicFacts:", err.message);
      }
    }, FACT_DELAY);
  });

  client.on("connected", () => {
    fastify.log.info("Twitch bot connected");
  });

  await client.connect();

  fastify.decorate("twitch", client);
}

module.exports = fp(twitchPlugin);