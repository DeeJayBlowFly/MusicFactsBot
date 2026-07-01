# 🎧 AI-DeeJayBlowFly

AI-powered Twitch Music Facts Bot for DJs and music streamers.

Automatically listens for **Now Playing** messages in Twitch chat and responds with unique AI-generated music facts.

---

# Features

- 🎵 Automatic Now Playing detection
- 🤖 GPT-5 Mini (OpenAI Responses API)
- 📀 MusicBrainz metadata
- 💿 Discogs metadata
- 📚 Wikipedia integration
- 🇩🇪 German music facts
- 🔁 No repeated facts
- ⚡ Intelligent cache
- 📊 Live Dashboard
- 🧪 Test Fact
- ❤️ Health API
- 📖 Swagger
- ✅ Automated tests

---

# Requirements

- Node.js 24
- OpenAI API key
- Twitch Bot Account
- Twitch OAuth Token

---

# Installation

```bash
git clone https://github.com/DeeJayBlowFly/MusicFactsBot.git

cd MusicFactsBot

npm install
```

Create:

```
.env
```

Example:

```env
OPENAI_API_KEY=

OPENAI_MODEL=gpt-5-mini

TWITCH_USER=

TWITCH_AUTH=

CHANNELS=

FACT_LANGUAGE=de

FACT_DELAY=500

PORT=3000
```

---

# Start

```bash
npm start
```

Dashboard:

```
http://localhost:3000
```

Swagger:

```
http://localhost:3000/docs
```

---

# Streaming Setup

## Streaming PC

- OBS
- VirtualDJ
- BlowFlyMusicBot

BlowFlyMusicBot writes:

```
Now Playing: Modern Talking - Cheri Cheri Lady
```

to Twitch chat.

---

## AI PC

Runs:

```
AI-DeeJayBlowFly
```

The bot:

- listens to Twitch chat
- detects Now Playing
- gathers metadata
- generates a music fact
- posts it back to chat

---

# Dashboard

Shows

- Status
- Now Playing
- Latest Fact
- Statistics
- Live Log

---

# Test

Chat:

```
!testfact ABBA - Dancing Queen
```

or use the Dashboard Test button.

---

# Build Desktop

Development

```bash
npm run desktop
```

Windows Installer

```bash
npm run dist
```

---

# License

MIT

---

# Version

v1.0 RC1