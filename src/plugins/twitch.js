const fp = require("fastify-plugin");
const tmi = require("tmi.js");

const { getFact } = require("../services/facts");

const NOW_PLAYING_PREFIX = "Now Playing:";
const FACT_DELAY = Number(process.env.FACT_DELAY || 8000);

let lastTrack = "";
let timer = null;

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

  client.on("connecting", (address, port) => {
    console.log("Connecting:", address, port);
  });

  client.on("connected", (address, port) => {
    console.log("CONNECTED:", address, port);
  });

  client.on("join", (channel, username, self) => {
    console.log("JOIN:", channel, username, self);
  });

  client.on("message", async (channel, tags, message, self) => {
    if (self) return;

    console.log("USER:", tags.username);
    console.log("MESSAGE:", message);

    if (tags.username.toLowerCase() !== "blowflymusicbot") return;

    if (!message.startsWith(NOW_PLAYING_PREFIX)) return;

    const track = message
      .replace(NOW_PLAYING_PREFIX, "")
      .replace(/"/g, "")
      .replace(/\.$/, "")
      .trim();

    if (!track) return;

    if (track === lastTrack) {
      console.log("Duplicate track ignored");
      return;
    }

    lastTrack = track;

    fastify.nowPlaying.set(track);

    if (timer) clearTimeout(timer);

    const factPromise = getFact(track, "de");

timer = setTimeout(async () => {
  try {
    console.log("Sending fact:", track);

    const fact = await factPromise;

    await client.say(channel, fact);

    console.log("Fact sent.");
  } catch (err) {
    console.error(err);
  }
}, FACT_DELAY);
  });

  client.on("disconnected", (reason) => {
    console.log("DISCONNECTED:", reason);
  });

  await client.connect();

  fastify.decorate("twitch", client);

  fastify.log.info("Twitch bot connected");
}

module.exports = fp(twitchPlugin);