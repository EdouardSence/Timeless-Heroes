@echo off
title Timeless Heroes - Launcher
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎮 TIMELESS HEROES 🎮                      ║
echo ║                   ~ Code Your Way to Glory ~                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Démarrage de l'infrastructure Docker...
docker-compose up -d postgres redis
 
echo [2/2] Démarrage du jeu avec le chat (Desktop App)...
start "Timeless Heroes - Game" cmd /k "cd /d %~dp0apps\desktop && pnpm dev"

echo.
echo ✅ Tout est lancé!
echo.
echo 📱 L'application de bureau (avec le chat) va s'ouvrir.
echo.
echo Appuie sur une touche pour fermer cette fenêtre...
pause > nul
