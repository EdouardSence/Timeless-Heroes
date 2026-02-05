
import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─ dist
// │ ├─ index.html
// │ ├─ assets
// │ └─ index.html
//
// ├─┬─ dist-electron
// │ ├─ main.js
// │ └─ preload.js
//
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null
let tray: Tray | null = null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 500,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    resizable: false,
    autoHideMenuBar: true,
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  // Hide window instead of closing when clicking 'X'
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win?.hide()
    }
    return false
  })
}

function createTray() {
  // Use a default icon or create one
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'tray.png')) // You'll need an icon here
  tray = new Tray(icon.isEmpty() ? path.join(process.env.VITE_PUBLIC, 'vite.svg') : icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Ouvrir', click: () => win?.show() },
    { type: 'separator' },
    { 
      label: 'Quitter', 
      click: () => {
        app.isQuitting = true
        app.quit()
      } 
    }
  ])

  tray.setToolTip('Timeless Heroes Agent')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    win?.show()
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // We don't quit here because we want the tray to keep running
    // app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Add property to handle quit
declare global {
  namespace Electron {
    interface App {
      isQuitting: boolean
    }
  }
}
app.isQuitting = false

app.whenReady().then(() => {
  createWindow()
  createTray()
})
