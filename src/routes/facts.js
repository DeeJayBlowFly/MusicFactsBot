const { getFact } = require("../services/facts");

async function factsRoutes(app) {

  app.get("/facts", async (request) => {

    const {
      track = "",
      lang = "en"
    } = request.query;

    const fact = await getFact(track, lang);

    return {
      track,
      language: lang,
      fact
    };

  });

}

module.exports = factsRoutes;