function formatUptime(started) {
  const seconds = Math.floor((Date.now() - started.getTime()) / 1000);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [
    days > 0 ? `${days}d` : null,
    `${String(hours).padStart(2, "0")}h`,
    `${String(minutes).padStart(2, "0")}m`,
    `${String(secs).padStart(2, "0")}s`
  ]
    .filter(Boolean)
    .join(" ");
}

const state = {

  started: new Date(),

  running: true,

  track: "",

  fact: "",

  factsSent: 0,

  uniqueSongs: new Set(),

  cacheHits: 0,

  lastResponseTime: 0,

  reconnects: 0,

  status: {
    twitch: false,
    openai: false,
    musicbrainz: false,
    discogs: false,
    wikipedia: false
  },

  logs: [],

  addLog(message, level = "INFO") {

    const time = new Date().toLocaleTimeString("de-DE");

    this.logs.unshift(
      `[${time}] [${level}] ${message}`
    );

    if (this.logs.length > 300) {
      this.logs.length = 300;
    }

  },

  setStatus(service, value) {

    if (service in this.status) {
      this.status[service] = value;
    }

  },

  setResponseTime(ms) {

    this.lastResponseTime = ms;

  },

  incrementCacheHit() {

    this.cacheHits++;

  },

  incrementReconnect() {

    this.reconnects++;

  },

  uptime() {

    return formatUptime(this.started);

  }

};

module.exports = state;