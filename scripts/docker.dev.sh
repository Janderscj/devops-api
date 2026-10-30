#!/bin/bash

# Startup script for Docker environment setup
# Setup Docker environment for development and production
echo "Setting up Docker environment..."

# Check if .env.development file exists
if [ ! -f ./.env.development ]; then
  echo ".env.development file not found!"
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running!"
  exit 1
fi

# Create .neon_local directory if it doesn't exist
if [ ! -d ./.neon_local ]; then
    mkdir -p ./.neon_local
fi

# Add neon_local to gitignore if not already present
if ! grep -q ".neon_local" .gitignore 2>/dev/null; then
  echo ".neon_local" >> .gitignore
  echo "Added .neon_local to .gitignore"
fi

echo "Building Docker environment..."
echo "  - neon local proxy will create ephemeral db branch"
echo "  - Application will run with hot reload enabled"
echo ""

# Run migrations with Drizzle
echo "Applying latest schema with Drizzle..."
npm run db:migrate

# Wait for the database to be ready
echo "Waiting for db to be ready..."
docker compose exec neon-local psql -U neon -d neondb -c "SELECT 1"

# Start development environment
docker compose -f compose.dev.yml up --build

echo "Docker environment started."
echo "  Application running on http://localhost:5173"
echo "  Database running on postgres://neon:npg@localhost:5432/neondb"
echo ""

