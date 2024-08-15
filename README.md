# NplusM.IO - Personal Portfolio Website

## Description

NplusM.IO is a modern, responsive personal portfolio website built with React for the frontend and Flask for the backend. It showcases projects, skills, and blog posts in an interactive and visually appealing manner. The site includes an admin dashboard for easy content management.

## Features

- Interactive 3D visualization of skills on the homepage
- Responsive design for optimal viewing on all devices
- Dynamic project showcase with filtering capabilities
- Blog section for sharing thoughts and experiences
- Timeline view of professional journey
- Contact form for easy communication
- Admin dashboard for managing projects, skills, and blog posts
- Dark theme with consistent styling across all pages

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Framer Motion for animations
- Three.js for 3D visualizations
- Axios for API requests
- CSS Modules for styling

### Backend
- Flask (Python)
- SQLAlchemy for database management
- Flask-JWT-Extended for authentication
- Flask-Bcrypt for password hashing
- Flask-CORS for handling Cross-Origin Resource Sharing

### Database
- PostgreSQL

## Installation

1. Clone the repository:
git clone https://github.com/yourusername/nplusm-web.git
cd nplusm-web
Copy
2. Install frontend dependencies:
cd frontend
npm install
Copy
3. Install backend dependencies:
cd ../backend
pip install -r requirements.txt
Copy
4. Set up the database:
- Create a PostgreSQL database
- Update the `DATABASE_URL` in the `.env` file

5. Set up environment variables:
- Create a `.env` file in the backend directory
- Add the following variables:
  ```
  DATABASE_URL=postgresql://username:password@localhost/database_name
  JWT_SECRET_KEY=your_secret_key
  ```

## Running the Application

1. Start the backend server:
cd backend
python app.py
Copy
2. In a new terminal, start the frontend development server:
cd frontend
npm start
Copy
3. Open your browser and navigate to `http://localhost:3000`

## Admin Dashboard

To access the admin dashboard:
1. Navigate to `/login`
2. Enter your admin credentials
3. You will be redirected to the admin dashboard at `/admin`

## Deployment

### Frontend
1. Build the React app:
cd frontend
npm run build
Deploy the contents of the `build` folder to your web server

### Backend
1. Set up a production-ready WSGI server like Gunicorn
2. Configure your web server (e.g., Nginx) to proxy requests to the WSGI server
3. Ensure all environment variables are set in your production environment