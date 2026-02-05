@echo off
title Timeless Heroes - Launcher
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎮 TIMELESS HEROES 🎮                      ║
echo ║                   ~ Code Your Way to Glory ~                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Démarrage du serveur de jeu...
start "Timeless Heroes - Game Server" cmd /k "cd /d %~dp0apps\keylogger && pnpm dev"

timeout /t 3 /nobreak > nul

echo [2/3] Démarrage du dashboard web...
start "Timeless Heroes - Dashboard" cmd /k "cd /d %~dp0apps\web && pnpm dev"

timeout /t 2 /nobreak > nul

echo [3/3] Démarrage du hook clavier...
echo.
echo ⚠️  Le script PowerShell va demander l'autorisation d'exécution.
echo     Tape "O" ou "Y" pour accepter.
echo.
pause

start "Timeless Heroes - Keyboard Hook" powershell -ExecutionPolicy Bypass -File "%~dp0apps\keylogger\keyboard-hook.ps1"

echo.
echo ✅ Tout est lancé!
echo.
echo 📱 Dashboard: http://localhost:3001/game
echo.
echo Appuie sur une touche pour fermer cette fenêtre...
pause > nul
