#!/bin/bash

# ClipVibe Start Script
# This script ensures the frontend is built and files are in the right place

echo "=== Starting ClipVibe ==="

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build frontend if not already built
if [ ! -d "frontend/build" ]; then
  echo "Building frontend..."
  cd frontend
  npm install
  npm run build
  cd ..
fi

# For Railway/Cyclic: Copy build files to root so Express can serve them
if [ "$NODE_ENV" = "production" ]; then
  echo "Copying build files to root for production..."
  cp -r frontend/build/* . 2>/dev/null || true
  cp -r frontend/build/.htaccess . 2>/dev/null || true
fi

# Start the server
echo "Starting server..."
node backend/server.js
