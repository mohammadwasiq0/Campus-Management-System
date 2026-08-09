#!/bin/bash
# Smart Campus ERP - Initialization Script
set -e

echo "=== Smart Campus ERP Initialization ==="

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is required"; exit 1; }

# Install dependencies
echo "Installing backend dependencies..."
cd backend && npm install

echo "Installing frontend dependencies..."
cd ../frontend && npm install

# Generate Prisma client
echo "Generating Prisma client..."
cd ../backend && npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "Seeding database..."
npx prisma db seed

# Build frontend
echo "Building frontend..."
cd ../frontend && npm run build

echo ""
echo "=== Initialization Complete ==="
echo "Run 'npm run dev' to start development servers"
echo "Or 'docker-compose up -d' for production deployment"
