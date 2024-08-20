#!/bin/bash
source /home/NplusM/.virtualenvs/venv/bin/activate  
pip install psycopg2-binary 
gunicorn backend.app:app 