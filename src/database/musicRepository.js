const db = require("./database");

const getSongStmt = db.prepare(`
SELECT *
FROM songs
WHERE artist = ? AND title = ?
`);

const insertSongStmt = db.prepare(`
INSERT OR IGNORE INTO songs
(
    artist,
    title,
    album,
    year,
    label,
    genre,
    style,
    wikipedia
)
VALUES
(
    @artist,
    @title,
    @album,
    @year,
    @label,
    @genre,
    @style,
    @wikipedia
)
`);

const getFactsStmt = db.prepare(`
SELECT fact
FROM facts
WHERE song_id = ?
ORDER BY id
`);

const insertFactStmt = db.prepare(`
INSERT INTO facts
(
    song_id,
    fact
)
VALUES
(
    ?,
    ?
)
`);

function getSong(artist, title) {
    return getSongStmt.get(artist, title) || null;
}

function saveSong(song) {
    insertSongStmt.run({
        artist: song.artist,
        title: song.title,
        album: song.album || "",
        year: song.year || "",
        label: song.label || "",
        genre: song.genre || "",
        style: song.style || "",
        wikipedia: song.wikipedia || ""
    });

    return getSong(song.artist, song.title);
}

function getFacts(songId) {
    return getFactsStmt.all(songId).map(r => r.fact);
}

function saveFact(songId, fact) {
    insertFactStmt.run(songId, fact);
}

module.exports = {
    getSong,
    saveSong,
    getFacts,
    saveFact
};