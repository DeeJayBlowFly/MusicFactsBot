async function healthRoutes(app) {
  app.get(
    "/health",
    {
      schema: {
        tags: ["System"],
        summary: "Health check",
        description: "Returns the health status of the API.",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return {
        status: "ok",
      };
    }
  );
}

module.exports = healthRoutes;