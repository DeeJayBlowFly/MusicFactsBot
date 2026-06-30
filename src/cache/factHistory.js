const history = new Map();

function get(track) {
  return history.get(track) || [];
}

function add(track, fact) {
  const facts = get(track);

  if (!facts.includes(fact)) {
    facts.push(fact);
  }

  history.set(track, facts);
}

function has(track, fact) {
  return get(track).includes(fact);
}

function count(track) {
  return get(track).length;
}

function clear(track) {
  history.delete(track);
}

module.exports = {
  get,
  add,
  has,
  count,
  clear,
};