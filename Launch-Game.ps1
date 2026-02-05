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

# 1. Start Game Server
Write-Host "[1/3] Demarrage du SERVEUR DE JEU (Port 9999)..." -ForegroundColor Yellow
$serverArgs = "-NoExit", "-Command", "cd 'apps\keylogger'; pnpm dev"
Start-Process powershell -ArgumentList $serverArgs

Write-Host "      En attente du demarrage..." -NoNewline

# Wait for port 9999 to be open
$retries = 0
while (-not (Check-Port 9999)) {
    Start-Sleep -Seconds 1
    Write-Host "." -NoNewline
    $retries++
    if ($retries -ge 30) {
        Write-Host ""
        Write-Error "Le serveur n'a pas demarre apres 30 secondes."
        exit 1
    }
}
Write-Host " OK!" -ForegroundColor Green

# 2. Start Web Dashboard
Write-Host "[2/3] Demarrage du DASHBOARD WEB (Port 3001)..." -ForegroundColor Yellow
$webArgs = "-NoExit", "-Command", "cd 'apps\web'; pnpm dev"
Start-Process powershell -ArgumentList $webArgs

# 3. Start Keyboard Hook
Write-Host "[3/3] Demarrage du HOOK CLAVIER..." -ForegroundColor Yellow
Write-Host "      Capture des touches activee." -ForegroundColor Gray
$hookArgs = "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "apps\keylogger\keyboard-hook.ps1"
Start-Process powershell -ArgumentList $hookArgs

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "                  TOUT EST LANCE !                    " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Le serveur de jeu tourne (fenetre 1)"
Write-Host "2. Le dashboard web demarre (fenetre 2)"
Write-Host "3. Le capturer de touches tourne (fenetre 3)"
Write-Host ""
Write-Host "DASHBOARD: http://localhost:3001/game"
