const { getFact } = require("../services/facts");

async function factsController(request, reply) {
  const { track, lang = "en" } = request.query;

  if (!track) {
    return reply.code(400).send({
      success: false,
      error: "Missing required query parameter: track"
    });
  }

  try {
    const fact = await getFact(track, lang);

    return {
      success: true,
      track,
      language: lang,
      fact
    };
  } catch (err) {
    request.log.error(err);

    return reply.code(500).send({
      success: false,
      error: "Unable to retrieve music fact."
    });
  }
}

module.exports = {
  factsController
};