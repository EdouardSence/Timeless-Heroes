
import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import path from 'node:path'

// The built directory structure
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null
let tray: Tray | null = null
let keyloggerProcess: ChildProcessWithoutNullStreams | null = null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function getScriptPath() {
  if (app.isPackaged) {
    // In production, resources are usually next to the executable or in resources folder
    return path.join(process.resourcesPath, 'scripts', 'keyboard-hook-secure.ps1')
  }
  
  // In development (pnpm run dev), we are at the root of apps/desktop
  // And the file is in resources/scripts
  return path.join(process.cwd(), 'resources', 'scripts', 'keyboard-hook-secure.ps1')
}

function startKeylogger() {
  const scriptPath = getScriptPath()
  const token = "DEV_TOKEN_PLACEHOLDER" // TODO: Get real token from Login

  console.log('Starting Keylogger from:', scriptPath)

  // Powershell arguments: -ExecutionPolicy Bypass -File <script> -ServerHost <host> -ServerPort <port> -Token <token>
  // Use 'pwsh' (PowerShell Core 7+) if available as it supports System.Text.Json
  // If not available, we might need a fallback or requiring user to install it.
  const powerShellExe = 'powershell.exe'; // Trying standard first, but failed.
  // Actually, let's try to detect or just switch to 'pwsh' if user has it.
  // Only PowerShell 7+ supports System.Text.Json out of the box easily or via newer .NET
  
  // Correction: To fix "System.Text.Json.dll not found" on standard PowerShell 5.1:
  // We should likely drop the dependency on System.Text.Json inside the PS1 script if we want max compatibility,
  // OR assume the user has PS7.
  
  // Let's try spawning 'pwsh' instead.
  // UPDATE: User does NOT have pwsh. Reverting to powershell.exe and fixing script compatibility.
  keyloggerProcess = spawn('powershell.exe', [
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', scriptPath,
    '-ServerHost', '127.0.0.1',
    '-ServerPort', '9999',
    '-Token', token
  ])

  keyloggerProcess.stdout.on('data', (data) => {
    const log = data.toString().trim()
    console.log('[PS1]', log)
    // Send logs to renderer for display
    win?.webContents.send('log-message', log)
  })

  keyloggerProcess.stderr.on('data', (data) => {
    console.error('[PS1 ERROR]', data.toString())
    win?.webContents.send('log-message', `ERROR: ${data.toString()}`)
  })

  keyloggerProcess.on('close', (code) => {
    console.log(`Keylogger process exited with code ${code}`)
    win?.webContents.send('status-update', 'stopped')
  })

  win?.webContents.send('status-update', 'running')
}

function stopKeylogger() {
  if (keyloggerProcess) {
    keyloggerProcess.kill()
    keyloggerProcess = null
  }
}

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
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  win.webContents.on('did-finish-load', () => {
    // Start keylogger when window is ready
    startKeylogger()
  })

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
  const icon = nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'tray.png'))
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep app running in tray
  }
})

app.on('before-quit', () => {
  stopKeylogger()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

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
