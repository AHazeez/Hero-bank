#!/bin/bash

# Hero Bank System Setup Script
# This script sets up the complete development environment

set -e

echo "🏦 Setting up Hero Bank System..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.6 or higher."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ All prerequisites are installed!"

# Start Oracle Database
echo "🗄️ Starting Oracle Database..."
cd backend
docker-compose up -d

# Wait for Oracle to be ready
echo "⏳ Waiting for Oracle Database to be ready..."
while ! docker-compose exec -T oracle-db bash -c 'echo "SELECT 1 FROM DUAL;" | sqlplus -s hero_bank/hero_bank@XEPDB1' &>/dev/null; do
    echo "Still waiting for Oracle..."
    sleep 10
done

echo "✅ Oracle Database is ready!"

# Build and start backend
echo "🚀 Building and starting backend..."
tools/apache-maven-3.9.9/bin/mvn.cmd clean spring-boot:run &
BACKEND_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
while ! curl -f http://localhost:8080/api/v1/health &>/dev/null; do
    echo "Still waiting for backend..."
    sleep 5
done

echo "✅ Backend is ready!"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start frontend
echo "🎨 Starting frontend..."
npm start &
FRONTEND_PID=$!

echo "🎉 Hero Bank System is now running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8080"
echo "📊 API Health: http://localhost:8080/api/v1/health"

# Save PIDs for cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

echo "💡 To stop the system, run: ./stop.sh"
echo "📚 For more information, see README.md"
