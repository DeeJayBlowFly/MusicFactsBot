const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let win;
let tray;
let backend;

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

function startBackend() {
  backend = spawn(process.execPath, ["src/server.js"], {
    cwd: path.join(__dirname, ".."),
    env: process.env,
    stdio: "inherit"
  });

  backend.on("exit", (code) => {
    console.log("Backend exited:", code);
  });
}

async function createWindow() {

  startBackend();

  await waitForServer("http://127.0.0.1:3000/health");

  win = new BrowserWindow({
    width: 1450,
    height: 920,
    show: false,
    autoHideMenuBar: true,
    title: "AI-DeeJayBlowFly",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
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

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: "Open Dashboard",
      click() {
        win.show();
      }
    },
    {
      type: "separator"
    },
    {
      label: "Quit",
      click() {
        app.isQuiting = true;

        if (backend) {
          backend.kill();
        }

        app.quit();
      }
    }
  ]));

  tray.on("double-click", () => {
    win.show();
  });
}

app.whenReady().then(createWindow);

app.on("activate", () => {
  if (win) {
    win.show();
  }
});

app.on("window-all-closed", () => {});

app.on("before-quit", () => {
  app.isQuiting = true;

  if (backend) {
    backend.kill();
  }
});