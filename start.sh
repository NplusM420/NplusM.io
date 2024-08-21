#!/bin/bash
echo "Current directory: $(pwd)"
echo "Listing contents:"
ls -la

# Install frontend dependencies and build
echo "Installing frontend dependencies and building"
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Set up and run the backend
echo "Setting up backend"
cd backend
if [ ! -d "venv" ]; then
  echo "Creating virtual environment"
  python3 -m venv venv
fi
echo "Activating virtual environment"
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies"
pip install -r requirements.txt

# Run database migrations (if using SQLAlchemy)
echo "Running database migrations"
flask db upgrade

# Start the application
echo "Starting Gunicorn"
gunicorn app:app