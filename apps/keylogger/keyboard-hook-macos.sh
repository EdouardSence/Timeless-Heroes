#!/bin/bash
# Timeless Heroes - Keyboard Hook for macOS (HTTP REST)
#
# Captures keyboard events and sends them to the api-gateway via HTTP.
# AUTO-RECONNECTION: Retries connection with exponential backoff.
#
# USAGE: ./keyboard-hook-macos.sh -t <JWT_TOKEN> [-h HOST] [-p PORT]
#
# NOTE: macOS requires Accessibility permissions for global keyboard capture.
# Go to System Settings > Privacy & Security > Accessibility
# and add your terminal app.

# ============================================================================
# CONFIGURATION
# ============================================================================

HOST="127.0.0.1"
PORT="${API_GATEWAY_PORT:-3000}"
TOKEN=""
MAX_RECONNECT_DELAY=30

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -t|--token) TOKEN="$2"; shift 2 ;;
        -h|--host)  HOST="$2"; shift 2 ;;
        -p|--port)  PORT="$2"; shift 2 ;;
        *) shift ;;
    esac
done

BASE_URL="http://${HOST}:${PORT}/api/v1/ingest"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}+===========================================================+${NC}"
echo -e "${CYAN}|       TIMELESS HEROES - macOS Keyboard Hook  (HTTP)       |${NC}"
echo -e "${CYAN}|       AUTO-RECONNECT enabled                              |${NC}"
echo -e "${CYAN}+===========================================================+${NC}"
echo ""

# ============================================================================
# PRE-CHECKS
# ============================================================================

if [ -z "$TOKEN" ]; then
    echo -e "${RED}[ERROR] JWT Token required!${NC}"
    echo "  Usage: ./keyboard-hook-macos.sh -t <your_jwt_token>"
    echo "  Get your token from the web app settings."
    exit 1
fi

if ! command -v curl &>/dev/null; then
    echo -e "${RED}[ERROR] curl is required (should be pre-installed on macOS).${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] curl found${NC}"

# ============================================================================
# HTTP AUTH & COMMUNICATION
# ============================================================================

SESSION_ID=""
USER_ID=""
IS_AUTHENTICATED=false
LAST_KEY_TIME=0
KEY_COUNT=0

authenticate() {
    local response
    response=$(curl -s -X POST "${BASE_URL}/auth" \
        -H "Content-Type: application/json" \
        -d "{\"token\":\"${TOKEN}\"}" \
        --connect-timeout 5 --max-time 10 2>/dev/null)

    if echo "$response" | grep -q '"success":true'; then
        SESSION_ID=$(echo "$response" | sed -n 's/.*"sessionId":"\([^"]*\)".*/\1/p')
        USER_ID=$(echo "$response" | sed -n 's/.*"userId":"\([^"]*\)".*/\1/p')
        IS_AUTHENTICATED=true
        return 0
    fi
    return 1
}

authenticate_with_retry() {
    local attempt=0
    local delay=1

    while true; do
        if authenticate; then
            echo -e "${GREEN}[OK] Authenticated as: ${USER_ID}${NC}"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -e "${YELLOW}[RECONNECT] Attempt $attempt - retrying in ${delay}s...${NC}"
        sleep "$delay"

        delay=$((delay * 2))
        if [ "$delay" -gt "$MAX_RECONNECT_DELAY" ]; then
            delay=$MAX_RECONNECT_DELAY
        fi
    done
}

send_key() {
    local category="$1"
    local now
    now=$(date +%s 2>/dev/null)
    now=$((now * 1000))  # macOS date doesn't support %3N, approximate ms
    local delta=$(( now - LAST_KEY_TIME ))
    [ "$LAST_KEY_TIME" -eq 0 ] && delta=100
    LAST_KEY_TIME=$now

    curl -s -X POST "${BASE_URL}/key" \
        -H "Content-Type: application/json" \
        -d "{\"userId\":\"${USER_ID}\",\"sessionId\":\"${SESSION_ID}\",\"keyCategory\":\"${category}\",\"timestamp\":${now},\"deltaMs\":${delta}}" \
        --connect-timeout 3 --max-time 5 >/dev/null 2>&1

    return $?
}

send_key_with_retry() {
    local category="$1"
    if ! send_key "$category"; then
        echo -e "\n${YELLOW}[WARN] Connection lost, reconnecting...${NC}"
        IS_AUTHENTICATED=false
        authenticate_with_retry
        send_key "$category"
    fi
}

# ============================================================================
# HEALTH CHECK (background)
# ============================================================================

health_check_loop() {
    while true; do
        sleep 10
        if $IS_AUTHENTICATED; then
            local status
            status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/ping" --connect-timeout 3 2>/dev/null)
            if [ "$status" != "200" ]; then
                IS_AUTHENTICATED=false
                echo -e "\n${YELLOW}[WARN] Server unreachable, will reconnect on next key...${NC}"
            fi
        fi
    done
}

# ============================================================================
# KEY CAPTURE
# ============================================================================

# macOS doesn't allow easy global keyboard capture for security reasons.
# This runs in interactive demo mode - press keys in this terminal to register them.
demo_mode() {
    echo -e "${YELLOW}macOS Keyboard Capture Limitations:${NC}"
    echo -e "${YELLOW}  macOS doesn't allow easy global keyboard capture for security.${NC}"
    echo -e "${YELLOW}  Press keys in this terminal to register them.${NC}"
    echo ""
    echo -e "${CYAN}Press any key to send a keypress, Ctrl+C to stop${NC}"
    echo ""

    while true; do
        read -rsn1 key
        if [ -n "$key" ]; then
            KEY_COUNT=$((KEY_COUNT + 1))
            send_key_with_retry "CHAR"
            echo -e "${GREEN}[KEY] #${KEY_COUNT} sent${NC}"
        fi
    done
}

# ============================================================================
# MAIN
# ============================================================================

echo ""
authenticate_with_retry
echo ""

# Start health check in background
health_check_loop &
HEALTH_PID=$!
trap "kill $HEALTH_PID 2>/dev/null; exit 0" SIGINT SIGTERM

demo_mode
