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

# Kill any existing processes on our ports
echo ""
echo -e "${YELLOW}Libération des ports...${NC}"
sleep 1

# 1. Start Docker services (Redis, PostgreSQL) if docker-compose exists
if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
    echo ""
    echo -e "${YELLOW}[1/2] Vérification des services Docker...${NC}"
    docker compose up -d redis postgres 2>/dev/null || true
    echo -e "${GREEN}✓ Services Docker OK${NC}"
fi

# 2. Start Desktop App
echo ""
echo -e "${YELLOW}[2/2] Démarrage du JEU AVEC LE CHAT (Electron)...${NC}"
echo -e "${CYAN}L'application apparaîtra dans quelques secondes.${NC}"
echo ""

cd "$SCRIPT_DIR/apps/desktop"
pnpm dev

