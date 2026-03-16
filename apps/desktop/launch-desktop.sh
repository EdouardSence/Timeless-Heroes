#!/bin/bash
# ============================================================================
# 🚀 Launch Timeless Heroes Desktop App (Linux/macOS)
# ============================================================================
# This script kills any running instances and restarts the app cleanly.
# Run with sudo for keyboard listener to work on some systems!
# ============================================================================

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        🎮 TIMELESS HEROES - Desktop App Launcher              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Navigate to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $SCRIPT_DIR"
echo ""

# ============================================================================
# Step 1: Kill existing processes
# ============================================================================
echo "🔪 Killing existing processes..."

# Kill Electron
if pgrep -x "electron" > /dev/null; then
    pkill -9 -x "electron"
    echo "   ✓ Killed Electron processes"
else
    echo "   - No Electron processes running"
fi

# Kill Node on port 4000 (Vite server)
VITE_PID=$(lsof -ti:4000 2>/dev/null)
if [ -n "$VITE_PID" ]; then
    kill -9 $VITE_PID 2>/dev/null
    echo "   ✓ Killed process on port 4000 (Vite)"
else
    echo "   - No process on port 4000"
fi

sleep 1
echo ""

# ============================================================================
# Step 2: Compile TypeScript
# ============================================================================
echo "🔨 Compiling Electron TypeScript..."
npx tsc -p tsconfig.electron.json
if [ $? -eq 0 ]; then
    echo "   ✓ Compilation successful"
else
    echo "   ✗ Compilation failed!"
    exit 1
fi
echo ""

# ============================================================================
# Step 3: Start Vite dev server (background)
# ============================================================================
echo "🌐 Starting Vite dev server..."
npm run dev:vite &
VITE_PID=$!
echo "   ✓ Vite starting in background (PID: $VITE_PID)"

# Wait for Vite to be ready
echo "   ⏳ Waiting for Vite to be ready..."
MAX_WAIT=30
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    if curl -s http://localhost:4000 > /dev/null 2>&1; then
        echo "   ✓ Vite is ready on http://localhost:4000"
        break
    fi
    sleep 1
    WAITED=$((WAITED + 1))
done

if [ $WAITED -ge $MAX_WAIT ]; then
    echo "   ⚠ Vite might not be ready, continuing anyway..."
fi
echo ""

# ============================================================================
# Step 4: Launch Electron
# ============================================================================
echo "🖥️ Launching Electron app..."
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Trap to cleanup on exit
cleanup() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "👋 Cleaning up..."
    
    # Kill Vite
    if [ -n "$VITE_PID" ] && kill -0 $VITE_PID 2>/dev/null; then
        kill $VITE_PID 2>/dev/null
        echo "   ✓ Stopped Vite server"
    fi
    
    echo ""
    echo "✨ Done! See you next time!"
    echo ""
}
trap cleanup EXIT

# Run Electron (this blocks until the app closes)
npx electron .
