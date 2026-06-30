function timestamp() {
  return new Date().toLocaleTimeString("da-DK", {
    hour12: false,
  });
}

function log(section, message) {
  console.log(`[${timestamp()}] ${section}: ${message}`);
}

module.exports = {
  log,
};