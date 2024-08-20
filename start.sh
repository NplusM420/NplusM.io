#!/bin/bash
source venv/bin/activate  
pip install psycopg2-binary 
gunicorn backend.app:app 