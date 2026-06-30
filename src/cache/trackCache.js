class TrackCache {
  constructor() {
    this.lastTrack = null;
    this.lastSeen = 0;
  }

  isDuplicate(track) {
    const now = Date.now();

    if (
      this.lastTrack === track &&
      now - this.lastSeen < 30000
    ) {
      return true;
    }

    this.lastTrack = track;
    this.lastSeen = now;

    return false;
  }
}

module.exports = new TrackCache();