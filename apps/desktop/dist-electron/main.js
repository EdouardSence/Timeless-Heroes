"use strict";
const electron = require("electron");
const node_child_process = require("node:child_process");
const path = require("node:path");
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path.join(__dirname, "../public");
let win;
let tray = null;
let keyloggerProcess = null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function getScriptPath() {
  if (electron.app.isPackaged) {
    return path.join(process.resourcesPath, "scripts", "keyboard-hook-secure.ps1");
  }
  return path.join(process.cwd(), "resources", "scripts", "keyboard-hook-secure.ps1");
}
function startKeylogger() {
  const scriptPath = getScriptPath();
  const token = "DEV_TOKEN_PLACEHOLDER";
  console.log("Starting Keylogger from:", scriptPath);
  keyloggerProcess = node_child_process.spawn("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    scriptPath,
    "-ServerHost",
    "127.0.0.1",
    "-ServerPort",
    "9999",
    "-Token",
    token
  ]);
  keyloggerProcess.stdout.on("data", (data) => {
    const log = data.toString().trim();
    console.log("[PS1]", log);
    win == null ? void 0 : win.webContents.send("log-message", log);
  });
  keyloggerProcess.stderr.on("data", (data) => {
    console.error("[PS1 ERROR]", data.toString());
    win == null ? void 0 : win.webContents.send("log-message", `ERROR: ${data.toString()}`);
  });
  keyloggerProcess.on("close", (code) => {
    console.log(`Keylogger process exited with code ${code}`);
    win == null ? void 0 : win.webContents.send("status-update", "stopped");
  });
  win == null ? void 0 : win.webContents.send("status-update", "running");
}
function stopKeylogger() {
  if (keyloggerProcess) {
    keyloggerProcess.kill();
    keyloggerProcess = null;
  }
}
function createWindow() {
  win = new electron.BrowserWindow({
    width: 400,
    height: 500,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    },
    resizable: false,
    autoHideMenuBar: true
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.webContents.on("did-finish-load", () => {
    startKeylogger();
  });
  win.on("close", (event) => {
    if (!electron.app.isQuitting) {
      event.preventDefault();
      win == null ? void 0 : win.hide();
    }
    return false;
  });
}
function createTray() {
  const icon = electron.nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, "tray.png"));
  tray = new electron.Tray(icon.isEmpty() ? path.join(process.env.VITE_PUBLIC, "vite.svg") : icon);
  const contextMenu = electron.Menu.buildFromTemplate([
    { label: "Ouvrir", click: () => win == null ? void 0 : win.show() },
    { type: "separator" },
    {
      label: "Quitter",
      click: () => {
        electron.app.isQuitting = true;
        electron.app.quit();
      }
    }
  ]);
  tray.setToolTip("Timeless Heroes Agent");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    win == null ? void 0 : win.show();
  });
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") ;
});
electron.app.on("before-quit", () => {
  stopKeylogger();
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.isQuitting = false;
electron.app.whenReady().then(() => {
  createWindow();
  createTray();
});
