#!/bin/bash
# Build the frontend
cd frontend
npm install --legacy-peer-deps
npm run build
# Move back to the root directory
cd ..
# Set up and run the backend
cd backend
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate 
gunicorn app:app