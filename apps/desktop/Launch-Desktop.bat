@echo off
title Timeless Heroes - Desktop App
echo ========================================
echo      TIMELESS HEROES - DESKTOP APP
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Demarrage du serveur Vite...
start "Vite Server" /MIN cmd /c "npm run dev:vite"

echo      Attente du serveur (5 secondes)...
timeout /t 5 /nobreak > nul

echo [2/2] Lancement d'Electron...
echo.
echo ========================================
echo   L'application est lancee!
echo   Widget flottant cree.
echo   Clique dessus pour ouvrir le menu.
echo ========================================
echo.

npm run dev:electron
