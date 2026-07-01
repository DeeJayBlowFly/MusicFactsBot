const topics = [
  "Story behind the song",
  "Recording",
  "Chart success",
  "Songwriter",
  "Producer",
  "Album",
  "Interesting trivia",
  "Cultural impact",
  "Artist career",
];

function randomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

module.exports = {
  randomTopic,
};