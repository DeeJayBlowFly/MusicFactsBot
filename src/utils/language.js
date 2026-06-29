const languages = {
  da: "Danish",
  de: "German",
  en: "English",
};

function getLanguage(code = "en") {
  return languages[code.toLowerCase()] || "English";
}

module.exports = {
  getLanguage,
};