#!/bin/bash

# Hero Bank System Stop Script
# This script stops all services gracefully

set -e

echo "🛑 Stopping Hero Bank System..."

# Stop frontend
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "🎨 Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm .frontend.pid
    fi
fi

# Stop backend
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "🚀 Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm .backend.pid
    fi
fi

# Stop Oracle Database
echo "🗄️ Stopping Oracle Database..."
cd backend
docker-compose down

echo "✅ Hero Bank System has been stopped!"
