async function versionRoutes(app) {
  app.get("/version", async () => {
    return {
      version: "2.0.0"
    };
  });
}

module.exports = versionRoutes;