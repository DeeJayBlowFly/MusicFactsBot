async function healthRoutes(app) {
  app.get("/health", async () => {
    return {
      status: "ok",
      service: "MusicFactsBot",
      version: "2.0.0"
    };
  });
}

module.exports = healthRoutes;