#!/bin/bash
# Timeless Heroes - Master Launcher for Linux
# Usage: ./launch-game.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if a port is open (multiple methods for compatibility)
check_port() {
    # Try multiple methods
    if command -v nc &> /dev/null; then
        nc -z 127.0.0.1 "$1" 2>/dev/null
    elif command -v ss &> /dev/null; then
        ss -tuln 2>/dev/null | grep -q ":$1 "
    elif command -v netstat &> /dev/null; then
        netstat -tuln 2>/dev/null | grep -q ":$1 "
    else
        # Fallback: try to connect with bash
        (echo >/dev/tcp/127.0.0.1/"$1") 2>/dev/null
    fi
}

# Kill process on port
kill_port() {
    if command -v fuser &> /dev/null; then
        fuser -k "$1/tcp" 2>/dev/null || true
    elif command -v lsof &> /dev/null; then
        lsof -ti :"$1" 2>/dev/null | xargs kill -9 2>/dev/null || true
    fi
}

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Arrêt des services...${NC}"
    kill_port 9999
    kill_port 9997
    kill_port 3001
    kill $(jobs -p) 2>/dev/null || true
    echo -e "${GREEN}Services arrêtés.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

clear
echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}                TIMELESS HEROES LAUNCHER               ${NC}"
echo -e "${CYAN}                      🐧 Linux                         ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""

# Check dependencies
echo -e "${YELLOW}Vérification des dépendances...${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm n'est pas installé${NC}"
    echo "   Installation: npm install -g pnpm"
    exit 1
fi
echo -e "${GREEN}✓ pnpm trouvé${NC}"

if ! command -v nc &> /dev/null; then
    echo -e "${YELLOW}⚠ netcat (nc) non trouvé - installation recommandée${NC}"
fi

# Kill any existing processes on our ports
echo ""
echo -e "${YELLOW}Libération des ports...${NC}"
kill_port 9999
kill_port 9997
kill_port 3001
sleep 1

# 1. Start Docker services (Redis, PostgreSQL) if docker-compose exists
if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo ""
    echo -e "${YELLOW}[0/3] Vérification des services Docker...${NC}"
    if ! docker compose ps 2>/dev/null | grep -q "running"; then
        echo -e "${YELLOW}      Démarrage de Redis et PostgreSQL...${NC}"
        docker compose up -d redis postgres 2>/dev/null || true
        sleep 2
    fi
    echo -e "${GREEN}✓ Services Docker OK${NC}"
fi

# 2. Start Game Server (Keylogger)
echo ""
echo -e "${YELLOW}[1/3] Démarrage du SERVEUR DE JEU (Port 9999)...${NC}"

cd "$SCRIPT_DIR/apps/keylogger"
pnpm dev > /tmp/timeless-keylogger.log 2>&1 &
KEYLOGGER_PID=$!
cd "$SCRIPT_DIR"

echo -n "      En attente du démarrage"
retries=0
while ! check_port 9999; do
    sleep 1
    echo -n "."
    retries=$((retries + 1))
    if [ $retries -ge 30 ]; then
        echo ""
        echo -e "${RED}❌ Le serveur n'a pas démarré après 30 secondes.${NC}"
        echo "   Logs: /tmp/timeless-keylogger.log"
        cat /tmp/timeless-keylogger.log
        exit 1
    fi
done
echo -e " ${GREEN}OK!${NC}"

# 3. Start Web Dashboard
echo -e "${YELLOW}[2/3] Démarrage du DASHBOARD WEB (Port 3001)...${NC}"

cd "$SCRIPT_DIR/apps/web"
pnpm dev > /tmp/timeless-web.log 2>&1 &
WEB_PID=$!
cd "$SCRIPT_DIR"

echo -n "      En attente du démarrage"
retries=0
while ! check_port 3001; do
    sleep 1
    echo -n "."
    retries=$((retries + 1))
    if [ $retries -ge 60 ]; then
        echo ""
        echo -e "${RED}❌ Le dashboard n'a pas démarré après 60 secondes.${NC}"
        echo "   Logs: /tmp/timeless-web.log"
        exit 1
    fi
done
echo -e " ${GREEN}OK!${NC}"

# 4. Instructions for keyboard hook
echo ""
echo -e "${YELLOW}[3/3] HOOK CLAVIER...${NC}"
echo -e "      ${CYAN}Dans un autre terminal, lance:${NC}"
echo -e "      ${GREEN}cd apps/keylogger && ./keyboard-hook-linux.sh${NC}"

echo ""
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}                  TOUT EST LANCÉ !                    ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo ""
echo -e "🎮 Serveur de jeu:  ${GREEN}localhost:9999${NC} (TCP)"
echo -e "🌐 WebSocket:       ${GREEN}localhost:9997${NC}"
echo -e "📊 Dashboard:       ${GREEN}http://localhost:3001/game${NC}"
echo ""
echo -e "${CYAN}Appuie sur Ctrl+C pour tout arrêter${NC}"
echo ""

# Keep script running and show logs
tail -f /tmp/timeless-keylogger.log /tmp/timeless-web.log 2>/dev/null || wait
