# Timeless Heroes - Master Launcher
$ErrorActionPreference = "Stop"

function Check-Port($port) {
    try {
        $tcp = New-Object Net.Sockets.TcpClient
        $tcp.Connect('127.0.0.1', $port)
        $tcp.Close()
        return $true
    } catch {
        return $false
    }
}

Clear-Host
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "                TIMELESS HEROES LAUNCHER               " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start Docker
Write-Host "[1/2] Demarrage de l'infrastructure Docker..." -ForegroundColor Yellow
docker-compose up -d postgres redis

# 2. Start Desktop App
Write-Host "[2/2] Demarrage du JEU AVEC LE CHAT (Electron)..." -ForegroundColor Yellow
$desktopArgs = "-NoExit", "-Command", "cd 'apps\desktop'; pnpm dev"
Start-Process powershell -ArgumentList $desktopArgs

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "                  TOUT EST LANCE !                    " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "L'application apparaîtra dans quelques secondes."
Write-Host "Le chat (CyberCat) reagira a vos touches clavier."
Write-Host ""
