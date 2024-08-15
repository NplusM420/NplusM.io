import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="portfolio_website",
    user="your_username",
    password="your_password"
)

cur = conn.cursor()

# Projects table
cur.execute('DROP TABLE IF EXISTS projects;')
cur.execute('''
    CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        image_url VARCHAR(200),
        technologies VARCHAR(200),
        status VARCHAR(20) DEFAULT 'current',
        start_date DATE,
        estimated_completion DATE,
        progress INTEGER DEFAULT 0,
        is_current BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Skills table
cur.execute('DROP TABLE IF EXISTS skills;')
cur.execute('''
    CREATE TABLE skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        level INTEGER NOT NULL
    )
''')

# Blog posts table
cur.execute('DROP TABLE IF EXISTS blog_posts;')
cur.execute('''
    CREATE TABLE blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content TEXT,
        image_url VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Contact form submissions table
cur.execute('DROP TABLE IF EXISTS contact_submissions;')
cur.execute('''
    CREATE TABLE contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(200),
        message TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

conn.commit()

cur.close()
conn.close()