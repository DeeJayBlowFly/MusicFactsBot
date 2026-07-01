const Database = require("better-sqlite3");

const db = new Database("musicfacts.db");

db.exec(`
CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    artist TEXT,
    title TEXT,
    album TEXT,
    year TEXT,
    label TEXT,
    genre TEXT,
    style TEXT,
    wikipedia TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artist,title)
);

CREATE TABLE IF NOT EXISTS facts (
    id INTEGER PRIMARY KEY,
    song_id INTEGER,
    fact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

module.exports = db;