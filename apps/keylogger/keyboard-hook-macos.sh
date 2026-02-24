#!/bin/bash
# Timeless Heroes - Keyboard Hook for macOS
# Captures keyboard events and sends them to the game server
# AUTO-RECONNECTION: Retries connection with exponential backoff
#
# USAGE: ./keyboard-hook-macos.sh
#
# NOTE: macOS requires accessibility permissions for keyboard capture.
# Go to System Preferences > Security & Privacy > Privacy > Accessibility
# and add your terminal app.

HOST="127.0.0.1"
PORT="${KEYLOGGER_TCP_PORT:-9999}"
MAX_RECONNECT_DELAY=30

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}+===========================================================+${NC}"
echo -e "${CYAN}|       TIMELESS HEROES - macOS Keyboard Hook               |${NC}"
echo -e "${CYAN}|       AUTO-RECONNECT enabled                              |${NC}"
echo -e "${CYAN}+===========================================================+${NC}"
echo ""

# Check for netcat
if ! command -v nc &> /dev/null; then
    echo -e "${RED}[ERROR] netcat (nc) not found. It should be pre-installed on macOS.${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] netcat found${NC}"

# Test server connection silently
test_connection() {
    nc -z "$HOST" "$PORT" 2>/dev/null
    return $?
}

# Wait for server with exponential backoff
wait_for_connection() {
    local attempt=0
    local delay=1
    
    while true; do
        if test_connection; then
            echo -e "${GREEN}[OK] Server connection OK (${HOST}:${PORT})${NC}"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo -e "${YELLOW}[RECONNECT] Attempt $attempt - server unreachable, retrying in ${delay}s...${NC}"
        sleep "$delay"
        
        # Exponential backoff capped at MAX_RECONNECT_DELAY
        delay=$((delay * 2))
        if [ "$delay" -gt "$MAX_RECONNECT_DELAY" ]; then
            delay=$MAX_RECONNECT_DELAY
        fi
    done
}

send_key() {
    echo "KEY:$1" | nc -w1 "$HOST" "$PORT" 2>/dev/null
    return $?
}

# Send key with automatic reconnection on failure
send_key_with_retry() {
    local key="$1"
    if ! send_key "$key"; then
        echo -e "\n${YELLOW}[WARN] Connection lost, reconnecting...${NC}"
        wait_for_connection
        send_key "$key"
    fi
}

# Wait for initial connection (do NOT exit)
wait_for_connection

echo ""
echo -e "${YELLOW}macOS Keyboard Capture Limitations:${NC}"
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
        send_key_with_retry "$key"
        echo -e "${GREEN}[KEY] Keypress $KEY_COUNT sent${NC}"
    fi
done
