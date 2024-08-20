#!/bin/bash
echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la
echo "Moving to frontend directory"
cd frontend
echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la
echo "Installing dependencies"
npm install --legacy-peer-deps
echo "Building frontend"
npm run build
echo "Moving back to root"
cd ..
echo "Current directory: $(pwd)"
echo "Moving to backend"
cd backend
if [ ! -d "venv" ]; then
  echo "Creating virtual environment"
  python3 -m venv venv
fi
echo "Activating virtual environment"
source venv/bin/activate 
echo "Starting Gunicorn"
gunicorn app:app