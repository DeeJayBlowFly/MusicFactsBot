const pkg = require("../package.json");
const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const http = require("http");

const startServer = require("../src/server");

let win;
let tray;
let server;

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    (function check() {
      http
        .get(url, (res) => {
          res.destroy();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > timeout) {
            reject(new Error("Backend timeout"));
          } else {
            setTimeout(check, 500);
          }
        });
    })();
  });
}

async function createWindow() {
  try {
    server = await startServer({
      port: 3000,
      host: "127.0.0.1",
    });
  } catch (err) {
    if (err.code === "EADDRINUSE") {
      console.log("Backend is already running on port 3000.");
    } else {
      console.error(err);
      app.quit();
      return;
    }
  }

  try {
    await waitForServer("http://127.0.0.1:3000/health");
  } catch (err) {
    console.error(err);
    app.quit();
    return;
  }

  win = new BrowserWindow({
    width: 1450,
    height: 920,
    show: false,
    autoHideMenuBar: true,
    title: `AI-DeeJayBlowFly v${pkg.version}`,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  await win.loadURL("http://127.0.0.1:3000");

  win.maximize();

  win.webContents.once("did-finish-load", () => {
    win.show();
    win.focus();
  });

  win.on("close", (e) => {
    if (!app.isQuiting) {
      e.preventDefault();
      win.hide();
    }
  });

  const icon = nativeImage.createFromPath(
    path.join(__dirname, "..", "assets", "tray.png")
  );

  tray = new Tray(icon);

  tray.setToolTip("AI-DeeJayBlowFly");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open Dashboard",
        click() {
          if (win) {
            win.show();
            win.focus();
          }
        },
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        click() {
          app.isQuiting = true;
          app.quit();
        },
      },
    ])
  );

  tray.on("double-click", () => {
    if (win) {
      win.show();
      win.focus();
    }
  });
}

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (win) {
    win.show();
    win.focus();
  }
});

app.on("window-all-closed", () => {
  // Hold appen kørende i tray
});

app.on("before-quit", async () => {
  app.isQuiting = true;

  if (server) {
    try {
      await server.close();
    } catch (_) {
      // Ignorer fejl ved lukning
    }
  }
});