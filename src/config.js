module.exports = {
  language: process.env.FACT_LANGUAGE || "de",
  delay: Number(process.env.FACT_DELAY || 500),
  maxLength: Number(process.env.FACT_MAX_LENGTH || 350),
  cacheHours: Number(process.env.CACHE_HOURS || 2),
  autoFacts: process.env.AUTO_FACTS !== "false",
};