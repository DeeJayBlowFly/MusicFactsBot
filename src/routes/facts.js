async function factsRoutes(app) {
  app.get("/facts", async (request) => {
    const { track = "", lang = "en" } = request.query;

    return {
      track,
      language: lang,
      message: "Facts endpoint coming soon..."
    };
  });
}

module.exports = factsRoutes;