const logElement = document.getElementById("log");

function addLog(message) {
    const time = new Date().toLocaleTimeString();

    logElement.textContent =
        `[${time}] ${message}\n` + logElement.textContent;

    logElement.scrollTop = 0;
}

async function api(url, method = "GET", body = undefined) {

    const options = {
        method
    };

    if (body !== undefined) {
        options.headers = {
            "Content-Type": "application/json"
        };

        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.json();
}

async function refresh() {

    try {

        const data = await api("/api/dashboard");

        document.getElementById("track").textContent =
            data.track || "Waiting...";

        document.getElementById("fact").textContent =
            data.fact || "Waiting...";

        document.getElementById("factsSent").textContent =
            data.factsSent;

        document.getElementById("songs").textContent =
            data.uniqueSongs;

        document.getElementById("cacheHits").textContent =
            data.cacheHits;

        document.getElementById("uptime").textContent =
            data.uptime;

        document.getElementById("twitch").textContent =
            data.status.twitch ? "🟢 Connected" : "🔴 Offline";

        document.getElementById("openai").textContent =
            data.status.openai ? "🟢 Online" : "🔴 Offline";

        document.getElementById("musicbrainz").textContent =
            data.status.musicbrainz ? "🟢 Online" : "🔴 Offline";

        document.getElementById("discogs").textContent =
            data.status.discogs ? "🟢 Online" : "🔴 Offline";

        document.getElementById("wikipedia").textContent =
            data.status.wikipedia ? "🟢 Online" : "🔴 Offline";

        if (Array.isArray(data.logs)) {
            logElement.textContent = data.logs.join("\n");
        }

    } catch (err) {

        console.error(err);

        addLog("Dashboard offline");

    }

}

document.getElementById("start").onclick = async () => {

    await api("/api/start", "POST");

    addLog("Bot started");

};

document.getElementById("stop").onclick = async () => {

    await api("/api/stop", "POST");

    addLog("Bot stopped");

};

document.getElementById("test").onclick = async () => {

    const track = document.getElementById("testTrack").value.trim();

    if (!track) {
        addLog("Please enter Artist - Title");
        return;
    }

    try {

        const result = await api("/api/testfact", "POST", { track });

        if (!result.success) {
            addLog("ERROR: " + (result.error || result.message));
            return;
        }

        document.getElementById("track").textContent = track;
        document.getElementById("fact").textContent = result.fact;

        addLog("Fact generated successfully.");

        document.getElementById("testTrack").value = "";

    } catch (err) {

        addLog("ERROR: " + err.message);

    }

};

document.getElementById("manualNowPlaying").onclick = async () => {

    const track = document.getElementById("testTrack").value.trim();

    if (!track) {
        addLog("Please enter Artist - Title");
        return;
    }

    try {

        const result = await api("/api/manual-now-playing", "POST", { track });

        if (!result.success) {
            addLog("ERROR: " + (result.error || result.message));
            return;
        }

        document.getElementById("track").textContent = track;
        document.getElementById("fact").textContent = result.fact;

        addLog("Manual Now Playing updated.");

        document.getElementById("testTrack").value = "";

    } catch (err) {

        addLog("ERROR: " + err.message);

    }

};

document.getElementById("testTrack").addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        document.getElementById("manualNowPlaying").click();
    }

});

refresh();

setInterval(refresh, 1000);

addLog("Dashboard ready.");
