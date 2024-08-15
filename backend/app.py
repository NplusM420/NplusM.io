import os
import sys
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import json
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__) 
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['PROFILE_UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'profile_images')
app.config['PROJECT_UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'project_images')
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

if not app.config['JWT_SECRET_KEY']:
    raise ValueError("No JWT_SECRET_KEY set for application")

CORS(app, resources={r"/api/*": {"origins": os.environ.get('ALLOWED_ORIGINS', '*').split(',')}})
db = SQLAlchemy(app)
migrate = Migrate(app, db) 
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)

# Ensure upload folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROFILE_UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROJECT_UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Models

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    technologies = db.Column(db.String(500))
    status = db.Column(db.String(50), default='current')
    start_date = db.Column(db.Date)
    estimated_completion = db.Column(db.Date)
    progress = db.Column(db.Integer, default=0)
    goals = db.Column(db.Text)
    more_info = db.Column(db.Text)
    link = db.Column(db.String(500))
    content = db.Column(db.Text)
    is_current = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url,
            'technologies': self.technologies,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'estimated_completion': self.estimated_completion.isoformat() if self.estimated_completion else None,
            'progress': self.progress,
            'goals': self.goals,
            'more_info': self.more_info,
            'link': self.link,
            'content': self.content,
            'is_current': self.is_current,
            'is_featured': self.is_featured
        }

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    is_current = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'level': self.level,
            'is_current': self.is_current
        }

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat()
        }

class ContactSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    tasks = db.Column(db.Text)
    experience = db.Column(db.Text)
    link = db.Column(db.String(500))

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'role': self.role,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'tasks': self.tasks,
            'experience': self.experience,
            'link': self.link
        }

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50), nullable=False)
    features = db.Column(db.Text)  # Store features as a JSON string
    image_url = db.Column(db.String(500))  

    def to_dict(self):
        try:
            features = json.loads(self.features) if self.features else []
        except json.JSONDecodeError:
            features = []
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon,
            'features': features,
            'image_url': self.image_url  
        }

class AdminProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))

    def to_dict(self):
        return {
            "id": self.id,
            "bio": self.bio,
            "image_url": self.image_url
        }

# Routes



@app.route('/')
def home():
    return "Welcome to NplusM.IO!"
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username == os.getenv('ADMIN_USERNAME') and password == os.getenv('ADMIN_PASSWORD'):
        access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/projects', methods=['GET', 'POST'])
def handle_projects():
    if request.method == 'GET':
        featured = request.args.get('featured', '').lower() == 'true'
        current = request.args.get('current', '').lower() == 'true'
        
        app.logger.info(f"Fetching projects. Featured: {featured}, Current: {current}")
        
        query = Project.query
        if featured:
            query = query.filter_by(is_featured=True)
        if current:
            query = query.filter_by(is_current=True)
        
        projects = query.all()
        project_data = [project.to_dict() for project in projects]
        
        app.logger.info(f"Sending {len(project_data)} projects")
        app.logger.debug(f"Project data: {project_data}")
        
        return jsonify(project_data)
    
    elif request.method == 'POST':
        data = request.json
        app.logger.info(f"Received new project data: {data}")
        
        try:
            new_project = Project(**data)
            db.session.add(new_project)
            db.session.commit()
            app.logger.info(f"Created new project with ID: {new_project.id}")
            return jsonify(new_project.to_dict()), 201
        except Exception as e:
            app.logger.error(f"Error creating new project: {str(e)}")
            db.session.rollback()
            return jsonify({"error": "Failed to create project"}), 500

@app.route('/api/projects/<int:project_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_project(project_id):
    project = Project.query.get_or_404(project_id)
    if request.method == 'GET':
        return jsonify(project.to_dict())
    elif request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(project, key, value)
        db.session.commit()
        return jsonify(project.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200

@app.route('/api/upload/project/<int:project_id>', methods=['POST'])
@jwt_required()
def upload_project_image(project_id):
    logger.info(f"Received upload request for project {project_id}")
    logger.debug(f"Files: {request.files}")
    
    if 'file' not in request.files:
        logger.warning("No file part in the request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.warning("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{project_id}_{file.filename}")
        file_path = os.path.join(app.config['PROJECT_UPLOAD_FOLDER'], filename)
        logger.info(f"Saving file to: {file_path}")
        
        try:
            file.save(file_path)
            logger.info(f"File saved successfully: {file_path}")
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            return jsonify({'error': 'Failed to save file'}), 500
        
        project = Project.query.get(project_id)
        if project:
            project.image_url = f'/Images/Projects/{filename}'
            try:
                db.session.commit()
                logger.info(f"Database updated for project {project_id}")
            except Exception as e:
                logger.error(f"Database error: {str(e)}")
                return jsonify({'error': 'Database error'}), 500
            
            return jsonify({'message': 'File uploaded successfully', 'path': project.image_url}), 200
        else:
            logger.warning(f"Project not found: {project_id}")
            return jsonify({'error': 'Project not found'}), 404
    
    logger.warning("File type not allowed")
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/Images/Projects/<path:filename>')
def project_images(filename):
    return send_from_directory(app.config['PROJECT_UPLOAD_FOLDER'], filename)

@app.route('/api/skills', methods=['GET', 'POST'])
def handle_skills():
    if request.method == 'GET':
        skills = Skill.query.all()
        return jsonify([skill.to_dict() for skill in skills])
    elif request.method == 'POST':
        data = request.json
        new_skill = Skill(**data)
        db.session.add(new_skill)
        db.session.commit()
        return jsonify(new_skill.to_dict()), 201

@app.route('/api/skills/<int:skill_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    if request.method == 'GET':
        return jsonify(skill.to_dict())
    elif request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(skill, key, value)
        db.session.commit()
        return jsonify(skill.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(skill)
        db.session.commit()
        return jsonify({"message": "Skill deleted successfully"}), 200

@app.route('/api/blog', methods=['GET', 'POST'])
def handle_blog_posts():
    if request.method == 'GET':
        posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in posts])
    elif request.method == 'POST':
        data = request.json
        new_post = BlogPost(**data)
        db.session.add(new_post)
        db.session.commit()
        return jsonify(new_post.to_dict()), 201

@app.route('/api/blog/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_blog_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    if request.method == 'GET':
        return jsonify(post.to_dict())
    elif request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(post, key, value)
        db.session.commit()
        return jsonify(post.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Blog post deleted successfully"}), 200

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    data = request.json
    new_submission = ContactSubmission(**data)
    db.session.add(new_submission)
    db.session.commit()

    msg = Message('New Contact Form Submission',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[app.config['MAIL_USERNAME']])  # Send to yourself
    msg.body = f'''
    New contact form submission:
    Name: {data['name']}
    Email: {data['email']}
    Subject: {data.get('subject', '')}
    Message: {data['message']}
    '''
    mail.send(msg)

    return jsonify({"message": "Contact form submitted successfully"}), 201

@app.route('/api/timeline', methods=['GET', 'POST'])
def handle_timeline():
    if request.method == 'GET':
        events = TimelineEvent.query.order_by(TimelineEvent.start_date.desc()).all()
        return jsonify([event.to_dict() for event in events])
    elif request.method == 'POST':
        data = request.json
        new_event = TimelineEvent(**data)
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201

@app.route('/api/timeline/<int:event_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_timeline_event(event_id):
    event = TimelineEvent.query.get_or_404(event_id)
    if request.method == 'GET':
        return jsonify(event.to_dict())
    elif request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            setattr(event, key, value)
        db.session.commit()
        return jsonify(event.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Timeline event deleted successfully"}), 200

@app.route('/api/services', methods=['GET', 'POST'])
def handle_services():
    if request.method == 'GET':
        services = Service.query.all()
        return jsonify([{
            **service.to_dict(),
            'image_url': service.image_url or ''  # Return empty string if image_url is None
        } for service in services])
    elif request.method == 'POST':
        data = request.json
        if 'features' in data:
            data['features'] = json.dumps(data['features'])
        new_service = Service(**data)
        db.session.add(new_service)
        db.session.commit()
        return jsonify(new_service.to_dict()), 201

@app.route('/api/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_service(service_id):
    service = Service.query.get_or_404(service_id)
    if request.method == 'GET':
        return jsonify(service.to_dict())
    elif request.method == 'PUT':
        data = request.json
        if 'features' in data:
            data['features'] = json.dumps(data['features'])
        for key, value in data.items():
            setattr(service, key, value)
        db.session.commit()
        return jsonify(service.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully"}), 200

@app.route('/api/upload/profile', methods=['POST'])
def upload_profile_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['PROFILE_UPLOAD_FOLDER'], filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'path': f'/static/profile_images/{filename}'}), 200
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/admin-profile', methods=['GET', 'PUT'])
@jwt_required()
def handle_admin_profile():
    profile = AdminProfile.query.first()
    if not profile:
        profile = AdminProfile(bio="", image_url="")
        db.session.add(profile)
        db.session.commit()

    if request.method == 'GET':
        return jsonify(profile.to_dict())
    elif request.method == 'PUT':
        data = request.form
        profile.bio = data.get('bio', profile.bio)
        
        if 'image' in request.files:
            file = request.files['image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['PROFILE_UPLOAD_FOLDER'], filename)
                file.save(file_path)
                profile.image_url = f'/static/profile_images/{filename}'

        db.session.commit()
        return jsonify({"message": "Profile updated successfully", "profile": profile.to_dict()}), 200

@app.route('/api/about', methods=['GET'])
def get_about():
    profile = AdminProfile.query.first()
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "bio": profile.bio,
        "image_url": profile.image_url
    })

@app.route('/api/upload/service/<int:service_id>', methods=['POST'])
@jwt_required()
def upload_service_image(service_id):
    logger.info(f"Received upload request for service {service_id}")
    logger.debug(f"Files: {request.files}")
    
    if 'file' not in request.files:
        logger.warning("No file part in the request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        logger.warning("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(f"service_{service_id}_{file.filename}")
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'services', filename)
        logger.info(f"Saving file to: {file_path}")
        
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            file.save(file_path)
            logger.info(f"File saved successfully: {file_path}")
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            return jsonify({'error': 'Failed to save file'}), 500
        
        service = Service.query.get(service_id)
        if service:
            service.image_url = f'/static/uploads/services/{filename}'
            try:
                db.session.commit()
                logger.info(f"Database updated for service {service_id}")
            except Exception as e:
                logger.error(f"Database error: {str(e)}")
                return jsonify({'error': 'Database error'}), 500
            
            return jsonify({'message': 'File uploaded successfully', 'path': service.image_url}), 200
        else:
            logger.warning(f"Service not found: {service_id}")
            return jsonify({'error': 'Service not found'}), 404
    
    logger.warning("File type not allowed")
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=False)