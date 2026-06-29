const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 timer

const cache = new Map();

let hits = 0;
let misses = 0;

function get(key) {
  const entry = cache.get(key);

  if (!entry) {
    misses++;
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    misses++;
    return null;
  }

  hits++;
  return entry.value;
}

function set(key, value, ttl = DEFAULT_TTL) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
}

function has(key) {
  return get(key) !== null;
}

function remove(key) {
  return cache.delete(key);
}

function clear() {
  cache.clear();
  hits = 0;
  misses = 0;
}

function stats() {
  return {
    entries: cache.size,
    hits,
    misses,
  };
}

module.exports = {
  get,
  set,
  has,
  remove,
  clear,
  stats,
  DEFAULT_TTL,
};
