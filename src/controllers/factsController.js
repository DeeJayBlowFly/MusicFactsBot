const { getFact } = require("../services/facts");

async function factsController(request, reply) {
  const { track, lang = "en" } = request.query;

  try {
    const fact = await getFact(track, lang);

    return {
      success: true,
      track,
      language: lang,
      fact,
    };
  } catch (err) {
    request.log.error(err);

    return reply.code(500).send({
      success: false,
      error: "Unable to retrieve music fact.",
    });
  }
}

async function manualNowPlayingController(request, reply) {
  const { track, lang = "en" } = request.body;

  if (!track || !track.trim()) {
    return reply.code(400).send({
      success: false,
      error: "Track is required.",
    });
  }

  try {
    const fact = await getFact(track.trim(), lang);

    return {
      success: true,
      track: track.trim(),
      language: lang,
      fact,
    };
  } catch (err) {
    request.log.error(err);

    return reply.code(500).send({
      success: false,
      error: "Unable to retrieve music fact.",
    });
  }
}

module.exports = {
  factsController,
  manualNowPlayingController,
};
