#!/bin/bash
# Timeless Heroes - Keyboard Hook for Linux
# Captures keyboard events and sends them to the game server
#
# USAGE: ./keyboard-hook-linux.sh
#
# REQUIREMENTS:
# - xinput (X11) or libinput (Wayland)
# - netcat (nc)
#
# INSTALLATION:
#   Ubuntu/Debian: sudo apt install xinput netcat
#   Fedora: sudo dnf install xinput nmap-ncat
#   Arch: sudo pacman -S xorg-xinput gnu-netcat

HOST="127.0.0.1"
PORT="${KEYLOGGER_TCP_PORT:-9999}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       🎮 TIMELESS HEROES - Linux Keyboard Hook 🎮        ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if running under X11 or Wayland
if [ -n "$WAYLAND_DISPLAY" ]; then
    DISPLAY_SERVER="wayland"
elif [ -n "$DISPLAY" ]; then
    DISPLAY_SERVER="x11"
else
    echo -e "${RED}❌ No display server detected. Run this in a graphical session.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Display server: ${DISPLAY_SERVER}${NC}"

# Check for required tools
check_tool() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓ $1 found${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ $1 not found${NC}"
        return 1
    fi
}

# Test connection to server (try multiple methods)
test_connection() {
    # Method 1: nc
    if command -v nc &>/dev/null && nc -z "$HOST" "$PORT" 2>/dev/null; then
        echo -e "${GREEN}✓ Server connection OK (${HOST}:${PORT})${NC}"
        return 0
    fi
    # Method 2: ss (check if port is listening)
    if command -v ss &>/dev/null && ss -tln 2>/dev/null | grep -q ":${PORT} "; then
        echo -e "${GREEN}✓ Server listening on port ${PORT}${NC}"
        return 0
    fi
    # Method 3: bash /dev/tcp
    if (echo >/dev/tcp/"$HOST"/"$PORT") 2>/dev/null; then
        echo -e "${GREEN}✓ Server connection OK (${HOST}:${PORT})${NC}"
        return 0
    fi
    # Method 4: curl
    if command -v curl &>/dev/null && curl -s --connect-timeout 1 "http://${HOST}:${PORT}" &>/dev/null; then
        echo -e "${GREEN}✓ Server connection OK (${HOST}:${PORT})${NC}"
        return 0
    fi
    
    echo -e "${RED}❌ Cannot connect to server at ${HOST}:${PORT}${NC}"
    echo -e "${YELLOW}   Make sure the keylogger server is running:${NC}"
    echo -e "${YELLOW}   pnpm --filter @app/keylogger dev${NC}"
    return 1
}

# Send key event to server (try multiple methods)
send_key() {
    local key="$1"
    # Method 1: nc
    if command -v nc &>/dev/null; then
        echo "KEY:$key" | nc -w1 "$HOST" "$PORT" 2>/dev/null && return 0
    fi
    # Method 2: bash /dev/tcp
    if (echo "KEY:$key" >/dev/tcp/"$HOST"/"$PORT") 2>/dev/null; then
        return 0
    fi
    # Method 3: socat
    if command -v socat &>/dev/null; then
        echo "KEY:$key" | socat - TCP:"$HOST":"$PORT" 2>/dev/null && return 0
    fi
    return 1
}

# Method 1: Using xinput for X11
capture_xinput() {
    echo -e "${CYAN}Using xinput to capture keyboard events...${NC}"
    echo -e "${YELLOW}Note: This requires listing available keyboards${NC}"
    echo ""
    
    # List keyboards
    echo "Available input devices:"
    xinput list | grep -i keyboard
    echo ""
    
    # Find the first keyboard device
    KEYBOARD_ID=$(xinput list | grep -i "keyboard" | grep -v "Virtual" | head -1 | grep -oP 'id=\K\d+')
    
    if [ -z "$KEYBOARD_ID" ]; then
        echo -e "${RED}❌ No keyboard found${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Using keyboard ID: $KEYBOARD_ID${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop${NC}"
    echo ""
    
    # Capture key events using xinput test
    xinput test "$KEYBOARD_ID" 2>/dev/null | while read -r line; do
        if [[ "$line" == *"key press"* ]]; then
            KEY=$(echo "$line" | awk '{print $NF}')
            send_key "$KEY"
            echo -ne "\r${GREEN}⌨ Key pressed: $KEY${NC}    "
        fi
    done
}

# Method 2: Using evtest (requires root)
capture_evtest() {
    echo -e "${CYAN}Using evtest to capture keyboard events...${NC}"
    echo -e "${YELLOW}Note: This requires root privileges${NC}"
    echo ""
    
    # Find keyboard device
    KEYBOARD_DEV=$(find /dev/input/by-id -name "*kbd*" 2>/dev/null | head -1)
    
    if [ -z "$KEYBOARD_DEV" ]; then
        KEYBOARD_DEV=$(find /dev/input/by-path -name "*kbd*" 2>/dev/null | head -1)
    fi
    
    if [ -z "$KEYBOARD_DEV" ]; then
        echo -e "${RED}❌ No keyboard device found in /dev/input${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ Using device: $KEYBOARD_DEV${NC}"
    echo -e "${CYAN}Press Ctrl+C to stop${NC}"
    echo ""
    
    sudo evtest "$KEYBOARD_DEV" 2>/dev/null | while read -r line; do
        if [[ "$line" == *"EV_KEY"* && "$line" == *"value 1"* ]]; then
            KEY=$(echo "$line" | grep -oP 'KEY_\w+')
            send_key "$KEY"
            echo -ne "\r${GREEN}⌨ Key pressed: $KEY${NC}    "
        fi
    done
}

# Method 3: Simple demo mode (no actual capture, simulates keypresses)
demo_mode() {
    echo -e "${YELLOW}Running in DEMO mode - simulating keypresses${NC}"
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
}

# Main
echo ""
echo -e "${CYAN}Checking requirements...${NC}"
echo ""

test_connection || exit 1
echo ""

# Try different capture methods
if [ "$DISPLAY_SERVER" = "x11" ] && check_tool "xinput"; then
    echo ""
    capture_xinput
elif check_tool "evtest"; then
    echo ""
    capture_evtest
else
    echo ""
    echo -e "${YELLOW}No suitable capture tool found.${NC}"
    echo -e "${YELLOW}Installing xinput: sudo apt install xinput${NC}"
    echo ""
    echo -e "${CYAN}Falling back to demo mode...${NC}"
    demo_mode
fi
