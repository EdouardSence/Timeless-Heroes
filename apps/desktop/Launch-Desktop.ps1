# ============================================================================
# Launch Timeless Heroes Desktop App (v2 - Robust)
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TIMELESS HEROES - Desktop Launcher   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 1. Kill everything
Write-Host "[STEP 1] Killing old processes..." -ForegroundColor Yellow
Get-Process -Name "electron" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# 2. Compile
Write-Host "[STEP 2] Compiling..." -ForegroundColor Yellow
npx tsc -p tsconfig.electron.json
if ($LASTEXITCODE -ne 0) { Write-Host "Compilation Failed!" -ForegroundColor Red; exit }
Write-Host "Compilation OK" -ForegroundColor Green

# 3. Start Vite (using Start-Process with RedirectStandardOutput to avoid hanging)
Write-Host "[STEP 3] Starting Vite..." -ForegroundColor Yellow
$vite = Start-Process -FilePath "npm" -ArgumentList "run dev:vite" -PassThru -NoNewWindow
# We don't hide window so you can see if it crashes, but npm run usually stays attached. 
# Actually, npm run dev:vite in Start-Process might spawn a CMD window. Let's try starting it in a visible separate window to be safe.

# Re-strategy: Open Vite in a separate minimised window so it stays alive reliably.
Start-Process -FilePath "cmd" -ArgumentList "/c npm run dev:vite" -WindowStyle Minimized

Write-Host "Waiting for Vite on port 4000..." -ForegroundColor Gray

# Loop check
$waited = 0
while ($waited -lt 20) {
    Start-Sleep -Seconds 1
    $waited++
    try {
        $conn = Test-NetConnection -ComputerName localhost -Port 4000 -InformationLevel Quiet
        if ($conn) {
            Write-Host "Vite is Ready!" -ForegroundColor Green
            break
        }
    } catch {}
    Write-Host "." -NoNewline -ForegroundColor DarkGray
}
Write-Host ""

# 4. Launch Electron
Write-Host "[STEP 4] Launching Electron..." -ForegroundColor Yellow
npx electron .

# Cleanup happens when Electron closes
Write-Host "Closing Vite..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
