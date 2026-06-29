const { factsController } = require("../controllers/factsController");

async function factsRoutes(app) {
  app.get("/facts", {
    schema: {
      querystring: {
        type: "object",
        required: ["track"],
        properties: {
          track: {
            type: "string",
            minLength: 1,
          },
          lang: {
            type: "string",
            enum: ["da", "de", "en"],
            default: "en",
          },
        },
      },
    },
    handler: factsController,
  });
}

module.exports = factsRoutes;