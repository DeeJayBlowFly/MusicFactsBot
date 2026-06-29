function validateFact(fact) {
  if (!fact || typeof fact !== "string") {
    throw new Error("OpenAI returned an invalid response.");
  }

  const text = fact.trim();

  if (text.length === 0) {
    throw new Error("OpenAI returned an empty response.");
  }

  if (text.length > 350) {
    return `${text.substring(0, 347)}...`;
  }

  return text;
}

module.exports = {
  validateFact,
};