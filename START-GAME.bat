@echo off
setlocal enabledelayedexpansion
title Timeless Heroes - Launcher
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎮 TIMELESS HEROES 🎮                      ║
echo ║                   ~ Code Your Way to Glory ~                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Kill any existing Timeless Heroes processes
echo [0/5] Nettoyage des anciens processus...
taskkill /FI "WINDOWTITLE eq Timeless Heroes*" /T /F >nul 2>&1
taskkill /IM node.exe /FI "WINDOWTITLE eq *Timeless*" /T /F >nul 2>&1
timeout /t 2 /nobreak

REM Check if Docker is running
echo [1/5] Vérification de Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas installé ou pas en cours d'exécution!
    echo    Lance Docker Desktop et réessaye.
    pause
    exit /b 1
)

echo [2/5] Démarrage de l'infrastructure (Docker Compose)...
echo    - PostgreSQL (5432)
echo    - Redis (6379)
echo    - NATS (4222)
echo    - API Gateway (3000)
echo    - Worker Game Loop (BullMQ)
echo    - Service Progression (3001)
echo    - Service Payment (3003)
docker-compose up -d

REM Wait for services to be healthy
timeout /t 5 /nobreak

echo [3/5] Vérification de la santé des services...
:check_services
docker-compose ps | findstr "healthy" >nul
if errorlevel 1 (
    echo    Initialisation en cours...
    timeout /t 3 /nobreak
    goto check_services
)

echo    ✅ Services lancés avec succès!

echo [4/5] Démarrage de l'app Electron (Desktop)...
start "Timeless Heroes - Game" cmd /k "cd /d %~dp0apps\desktop && pnpm dev"

timeout /t 2 /nobreak

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              ✅ TIMELESS HEROES EST LANCÉ!                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📝 Services actifs:
echo.
echo   🎮 Frontend (Electron) ............ http://localhost:4000
echo   🔌 API Gateway .................... http://localhost:3000
echo   📡 NATS (Message Bus) ............. nats://localhost:4222
echo   👤 Service Progression ............ NATS microservice
echo   🔄 Worker Game Loop ............... BullMQ worker
echo   💳 Service Payment ................ http://localhost:3003
echo   💾 PostgreSQL ..................... localhost:5432
echo   📊 Redis .......................... localhost:6379
echo.
echo 🔐 Pour tester l'authentification:
echo.
echo   1. Créer un compte:
echo      POST http://localhost:3000/api/v1/auth/register
echo      {"email":"user@example.com","password":"pass123","username":"Player1"}
echo.
echo   2. Se connecter:
echo      POST http://localhost:3000/api/v1/auth/login
echo      {"email":"user@example.com","password":"pass123"}
echo.
echo   3. Utiliser le token JWT reçu dans l'app
echo.
echo Pour arrêter tout: lancer "docker-compose down" ou ferme les fenêtres
echo.
echo Appuie sur une touche pour fermer cette fenêtre...
pause > nul
