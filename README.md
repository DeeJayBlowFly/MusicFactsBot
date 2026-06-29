# 🎵 MusicFactsBot

AI-powered music facts API for Twitch bots and streaming applications.

Built with Fastify 5, Node.js 24 and OpenAI Responses API.

---

## Features

- ⚡ Fastify 5
- 🤖 OpenAI SDK v6 (Responses API)
- 🎵 AI-generated music facts
- 🌍 Danish, English and German
- 🧠 Intelligent track parser
- 🚀 In-memory cache
- ✅ Input validation
- 📚 Swagger / OpenAPI
- 🛡️ Global Rate Limiting
- ❤️ Health endpoint
- 🔖 Version endpoint
- 🧪 Automated tests
- 🔄 GitHub Actions CI

---

## Requirements

- Node.js 24 LTS
- OpenAI API Key

---

## Installation

```bash
git clone https://github.com/DeeJayBlowFly/MusicFactsBot.git

cd MusicFactsBot

npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5-mini
PORT=3000
RATE_LIMIT_MAX=60
RATE_LIMIT_WINDOW=1 minute
```

Start development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## API

### Health

```
GET /health
```

### Version

```
GET /version
```

### Music Facts

```
GET /facts
```

Example:

```
GET /facts?track=Modern Talking - Cheri Cheri Lady&lang=en
```

---

## Swagger

```
http://localhost:3000/docs
```

OpenAPI JSON:

```
http://localhost:3000/docs/json
```

---

## Tests

Run all tests:

```bash
npm test
```

Current status:

```
18 tests passing
```

---

## Deployment

Ready for deployment on Render.

---

## License

MIT License