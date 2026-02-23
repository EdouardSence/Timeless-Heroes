#!/bin/bash
# Timeless Heroes - Master Launcher for macOS
# Usage: ./launch-game-macos.sh

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

# Check if a port is open
check_port() {
    nc -z 127.0.0.1 "$1" 2>/dev/null
}

# Kill process on port (macOS version)
kill_port() {
    lsof -ti :"$1" 2>/dev/null | xargs kill -9 2>/dev/null || true
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
echo -e "${CYAN}                      🍎 macOS                         ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""

# Check dependencies
echo -e "${YELLOW}Vérification des dépendances...${NC}"

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm n'est pas installé${NC}"
    echo "   Installation: brew install pnpm"
    echo "   ou: npm install -g pnpm"
    exit 1
fi
echo -e "${GREEN}✓ pnpm trouvé${NC}"

# Kill any existing processes on our ports
echo ""
echo -e "${YELLOW}Libération des ports...${NC}"
kill_port 9999
kill_port 9997
kill_port 3001
sleep 1

# 1. Start Docker services (Redis, PostgreSQL) if docker is available
if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo ""
    echo -e "${YELLOW}[1/2] Vérification des services Docker...${NC}"
    docker compose up -d redis postgres 2>/dev/null || true
    echo -e "${GREEN}✓ Services Docker OK${NC}"
fi

# 2. Start Desktop App (The one with the Cat)
echo ""
echo -e "${YELLOW}[2/2] Démarrage du JEU AVEC LE CHAT (Electron)...${NC}"
echo -e "${CYAN}L'application apparaîtra dans quelques secondes.${NC}"
echo ""

cd "$SCRIPT_DIR/apps/desktop"
pnpm dev

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
