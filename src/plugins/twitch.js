const fp = require("fastify-plugin");
const tmi = require("tmi.js");
const axios = require("axios");

const NOW_PLAYING_PREFIX = "Now Playing:";

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

    // Gem Now Playing
    if (
  tags.username.toLowerCase() === "blowflymusicbot" &&
  message.startsWith(NOW_PLAYING_PREFIX)
) {
      const track = message
        .replace(NOW_PLAYING_PREFIX, "")
        .replace(/"/g, "")
        .trim();

      fastify.nowPlaying.set(track);
      return;
    }

    // !fact
    if (message.trim().startsWith("!fact")) {
      try {
        const track = fastify.nowPlaying.get();

        if (!track) {
          await client.say(channel, "🎵 Ingen sang registreret endnu.");
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/facts?track=${encodeURIComponent(track)}&lang=de`
        );

        await client.say(channel, res.data.fact);
      } catch (err) {
        console.error(err.message);
        await client.say(channel, "Kunne ikke hente musikfakta.");
      }
    }
  });

  client.on("disconnected", (reason) => {
    console.log("DISCONNECTED:", reason);
  });

  client.on("notice", (channel, msgid, message) => {
    console.log("NOTICE:", msgid, message);
  });

  await client.connect();

  fastify.decorate("twitch", client);

  fastify.log.info("Twitch bot connected");
}

module.exports = fp(twitchPlugin);