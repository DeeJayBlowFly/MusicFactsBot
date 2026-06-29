const { factsController } = require("../controllers/factsController");

async function factsRoutes(app) {
  app.get("/facts", factsController);
}

module.exports = factsRoutes;