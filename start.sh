#!/bin/bash
if [ ! -d "venv" ]; then  # Check if the 'venv' directory exists
  python3 -m venv venv    # Create it if it doesn't exist
fi
source venv/bin/activate 
pip install psycopg2-binary  
gunicorn backend.app:app