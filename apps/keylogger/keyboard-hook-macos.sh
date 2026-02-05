#!/bin/bash
# Timeless Heroes - Keyboard Hook for macOS
# Captures keyboard events and sends them to the game server
#
# USAGE: ./keyboard-hook-macos.sh
#
# NOTE: macOS requires accessibility permissions for keyboard capture.
# Go to System Preferences > Security & Privacy > Privacy > Accessibility
# and add your terminal app.

HOST="127.0.0.1"
PORT="${KEYLOGGER_TCP_PORT:-9999}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       🎮 TIMELESS HEROES - macOS Keyboard Hook 🎮        ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check for netcat
if ! command -v nc &> /dev/null; then
    echo -e "${RED}❌ netcat (nc) not found. It should be pre-installed on macOS.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ netcat found${NC}"

# Test connection
if nc -z "$HOST" "$PORT" 2>/dev/null; then
    echo -e "${GREEN}✓ Server connection OK (${HOST}:${PORT})${NC}"
else
    echo -e "${RED}❌ Cannot connect to server at ${HOST}:${PORT}${NC}"
    echo -e "${YELLOW}   Make sure the keylogger server is running:${NC}"
    echo -e "${YELLOW}   pnpm --filter @app/keylogger dev${NC}"
    exit 1
fi

send_key() {
    echo "KEY:$1" | nc -w1 "$HOST" "$PORT" 2>/dev/null
}

echo ""
echo -e "${YELLOW}⚠️  macOS Keyboard Capture Limitations:${NC}"
echo -e "${YELLOW}   macOS doesn't allow easy global keyboard capture for security.${NC}"
echo -e "${YELLOW}   This script runs in demo mode - press keys here to register.${NC}"
echo ""
echo -e "${CYAN}Press any key to simulate a keypress, Ctrl+C to stop${NC}"
echo ""

KEY_COUNT=0
while true; do
    read -rsn1 key
    if [ -n "$key" ]; then
        ((KEY_COUNT++))
        send_key "$key"
        echo -e "${GREEN}⌨ Keypress $KEY_COUNT sent${NC}"
    fi
done
