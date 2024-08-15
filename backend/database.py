import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

def get_db_connection():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    return conn

def get_projects():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM projects ORDER BY created_at DESC")
    projects = cur.fetchall()
    cur.close()
    conn.close()
    return projects

def add_project(title, description):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (title, description) VALUES (%s, %s) RETURNING id",
                (title, description))
    project_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return project_id