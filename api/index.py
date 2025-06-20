import os
from flask import Flask, jsonify, request
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
from sqlalchemy.exc import SQLAlchemyError
from supabase import create_client, Client
import uuid # For generating unique filenames

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# --- App Initialization ---
# Triggering new deployment with updated Vercel settings.
# Build database URI from individual components
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_port = os.getenv("DB_PORT")
db_name = os.getenv("DB_NAME")
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}" # This should now point to your Supabase DB via .env
app.config['SQLALCHEMY_POOL_SIZE'] = int(os.environ.get('DB_POOL_SIZE', 5))
app.config['SQLALCHEMY_MAX_OVERFLOW'] = int(os.environ.get('DB_MAX_OVERFLOW', 10))
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('EMAIL_PASS')

# app.config['UPLOAD_FOLDER'] and related local upload paths are removed
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # Max file size for uploads
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

if not app.config['JWT_SECRET_KEY']:
    raise ValueError("No JWT_SECRET_KEY set for application")

# Supabase Client Initialization
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise ValueError("Supabase URL or Anon Key not configured in environment variables.")

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
BUCKET_NAME = "site-uploads" # As created in your Supabase project

db = SQLAlchemy(app)
migrate = Migrate(app, db)

CORS(app, resources={r"/api/*": {"origins": f"https://{os.environ.get('VERCEL_URL')}" if os.environ.get('VERCEL_URL') else "*"}})
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)

# os.makedirs calls for local /tmp upload folders are removed

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Models (Remain the same)
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500)) # Will store Supabase public URL
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
    image_url = db.Column(db.String(500)) # Potentially Supabase URL if blog images are implemented
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
    end_date = db.Column(db.Date) # Nullable for current roles
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
    icon = db.Column(db.String(50), nullable=False) # e.g., FontAwesome class
    features = db.Column(db.Text) # JSON string or comma-separated
    image_url = db.Column(db.String(500)) # Will store Supabase public URL

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'icon': self.icon,
            'features': json.loads(self.features) if self.features else [], # Assuming features are stored as JSON string
            'image_url': self.image_url
        }

class AdminProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500)) # Will store Supabase public URL

    def to_dict(self):
        return {
            'id': self.id,
            'bio': self.bio,
            'image_url': self.image_url
        }

# Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME')
    ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH') # Assuming you store the hash

    if not ADMIN_USERNAME or not ADMIN_PASSWORD_HASH:
         # Fallback to plain text if hash not set (less secure, for initial setup)
        ADMIN_PLAIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
        if username == ADMIN_USERNAME and password == ADMIN_PLAIN_PASSWORD:
            access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'error': 'Invalid credentials - Dev Mode Check'}), 401

    # Production check against bcrypt hash (if ADMIN_PASSWORD_HASH is set)
    # This requires you to pre-hash your admin password and store the hash in env
    # if username == ADMIN_USERNAME and bcrypt.check_password_hash(ADMIN_PASSWORD_HASH, password):
    #     access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
    #     return jsonify(access_token=access_token), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/api/projects', methods=['GET', 'POST'])
@jwt_required(optional=True) # GET is public, POST requires JWT
def handle_projects():
    if request.method == 'GET':
        projects = Project.query.all()
        return jsonify([project.to_dict() for project in projects]), 200
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify(msg="Admin access required"), 401
        
        data = request.json
        new_project = Project(
            title=data['title'], 
            description=data['description'],
            technologies=data.get('technologies'),
            status=data.get('status', 'current'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            estimated_completion=datetime.fromisoformat(data['estimated_completion']) if data.get('estimated_completion') else None,
            progress=data.get('progress', 0),
            goals=data.get('goals'),
            more_info=data.get('more_info'),
            link=data.get('link'),
            content=data.get('content'),
            is_current=data.get('is_current', False),
            is_featured=data.get('is_featured', False)
            # image_url will be set via separate upload endpoint
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify(new_project.to_dict()), 201

@app.route('/api/projects/<int:project_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required(optional=True) # GET is public, PUT/DELETE requires JWT
def handle_project(project_id):
    project = Project.query.get_or_404(project_id)
    if request.method == 'GET':
        return jsonify(project.to_dict()), 200
    
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify(msg="Admin access required"), 401

    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            if key == 'start_date' or key == 'estimated_completion':
                setattr(project, key, datetime.fromisoformat(value) if value else None)
            elif hasattr(project, key):
                setattr(project, key, value)
        db.session.commit()
        return jsonify(project.to_dict()), 200
    elif request.method == 'DELETE':
        # Consider deleting associated image from Supabase here if needed
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project deleted successfully"}), 200

@app.route('/api/upload/project/<int:project_id>', methods=['POST'])
@jwt_required()
def upload_project_image(project_id):
    logger.info(f"Received upload request for project {project_id}")
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        unique_suffix = uuid.uuid4().hex[:8] # 8-char unique ID
        supabase_path = f"project_images/{project_id}_{unique_suffix}_{original_filename}"
        
        try:
            file.seek(0) # Ensure file pointer is at the beginning
            supabase_client.storage.from_(BUCKET_NAME).upload(
                path=supabase_path,
                file=file.read(), # Read file content as bytes
                file_options={"content-type": file.content_type, "cache-control": "3600", "upsert": "false"}
            )
            public_url = supabase_client.storage.from_(BUCKET_NAME).get_public_url(supabase_path)
        except Exception as e:
            logger.error(f"Error uploading project image to Supabase: {str(e)}")
            return jsonify({'error': f'Failed to upload file to Supabase: {str(e)}'}), 500
        
        project = Project.query.get(project_id)
        if project:
            project.image_url = public_url # Store the full public URL
            try:
                db.session.commit()
            except Exception as e:
                logger.error(f"Database error after Supabase upload: {str(e)}")
                return jsonify({'error': 'Database error after file upload'}), 500
            return jsonify({'message': 'File uploaded successfully', 'path': project.image_url}), 200
        else:
            # Optionally delete uploaded file from Supabase if project not found
            try:
                supabase_client.storage.from_(BUCKET_NAME).remove([supabase_path])
            except Exception as e_remove:
                logger.error(f"Failed to remove orphaned file from Supabase: {supabase_path}, error: {str(e_remove)}")
            return jsonify({'error': 'Project not found'}), 404
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/skills', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_skills():
    if request.method == 'GET':
        skills = Skill.query.all()
        return jsonify([skill.to_dict() for skill in skills]), 200
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user: return jsonify(msg="Admin access required"), 401
        data = request.json
        new_skill = Skill(name=data['name'], level=data['level'], is_current=data.get('is_current', True))
        db.session.add(new_skill)
        db.session.commit()
        return jsonify(new_skill.to_dict()), 201

@app.route('/api/skills/<int:skill_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_skill(skill_id):
    skill = Skill.query.get_or_404(skill_id)
    if request.method == 'PUT':
        data = request.json
        for key, value in data.items(): setattr(skill, key, value)
        db.session.commit()
        return jsonify(skill.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(skill)
        db.session.commit()
        return jsonify({"message": "Skill deleted successfully"}), 200

@app.route('/api/blog-posts', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_blog_posts():
    if request.method == 'GET':
        posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in posts]), 200
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user: return jsonify(msg="Admin access required"), 401
        data = request.json
        new_post = BlogPost(title=data['title'], content=data['content'], image_url=data.get('image_url'))
        db.session.add(new_post)
        db.session.commit()
        return jsonify(new_post.to_dict()), 201

@app.route('/api/blog-posts/<int:post_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required(optional=True)
def handle_blog_post(post_id):
    post = BlogPost.query.get_or_404(post_id)
    if request.method == 'GET':
        return jsonify(post.to_dict()), 200
    
    current_user = get_jwt_identity()
    if not current_user: return jsonify(msg="Admin access required"), 401
    
    if request.method == 'PUT':
        data = request.json
        for key, value in data.items(): setattr(post, key, value)
        db.session.commit()
        return jsonify(post.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "Blog post deleted successfully"}), 200

@app.route('/api/contact', methods=['POST'])
def submit_contact_form():
    data = request.json
    try:
        submission = ContactSubmission(
            name=data['name'], 
            email=data['email'], 
            subject=data.get('subject'), 
            message=data['message']
        )
        db.session.add(submission)
        db.session.commit()

        # Send email notification
        msg = Message(
            subject=f"New Contact Form Submission: {data.get('subject', 'No Subject')}",
            sender=app.config['MAIL_USERNAME'],
            recipients=[app.config['MAIL_USERNAME']], # Send to yourself
            body=f"Name: {data['name']}\nEmail: {data['email']}\nSubject: {data.get('subject', 'N/A')}\nMessage:\n{data['message']}"
        )
        mail.send(msg)
        return jsonify({"message": "Form submitted successfully!"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Database error on contact submission: {str(e)}")
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        logger.error(f"Error sending contact email or saving submission: {str(e)}")
        return jsonify({"error": "Failed to submit form"}), 500

@app.route('/api/timeline', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_timeline():
    if request.method == 'GET':
        events = TimelineEvent.query.order_by(TimelineEvent.start_date.desc()).all()
        return jsonify([event.to_dict() for event in events]), 200
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user: return jsonify(msg="Admin access required"), 401
        data = request.json
        new_event = TimelineEvent(
            company=data['company'], 
            role=data['role'],
            start_date=datetime.fromisoformat(data['start_date']).date(),
            end_date=datetime.fromisoformat(data['end_date']).date() if data.get('end_date') else None,
            tasks=data.get('tasks'),
            experience=data.get('experience'),
            link=data.get('link')
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_dict()), 201

@app.route('/api/timeline/<int:event_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_timeline_event(event_id):
    event = TimelineEvent.query.get_or_404(event_id)
    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            if key == 'start_date' or key == 'end_date':
                setattr(event, key, datetime.fromisoformat(value).date() if value else None)
            else:
                setattr(event, key, value)
        db.session.commit()
        return jsonify(event.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Timeline event deleted successfully"}), 200

@app.route('/api/services', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_services():
    if request.method == 'GET':
        services = Service.query.all()
        return jsonify([service.to_dict() for service in services]), 200
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user: return jsonify(msg="Admin access required"), 401
        data = request.json
        new_service = Service(
            title=data['title'], 
            description=data['description'],
            icon=data['icon'],
            features=json.dumps(data.get('features', [])), # Store features as JSON string
            # image_url will be set via separate upload endpoint
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify(new_service.to_dict()), 201

@app.route('/api/services/<int:service_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required(optional=True)
def handle_service(service_id):
    service = Service.query.get_or_404(service_id)
    if request.method == 'GET':
        return jsonify(service.to_dict()), 200
    
    current_user = get_jwt_identity()
    if not current_user: return jsonify(msg="Admin access required"), 401

    if request.method == 'PUT':
        data = request.json
        for key, value in data.items():
            if key == 'features':
                setattr(service, key, json.dumps(value))
            elif hasattr(service, key):
                setattr(service, key, value)
        db.session.commit()
        return jsonify(service.to_dict()), 200
    elif request.method == 'DELETE':
        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully"}), 200

# Removed standalone /api/upload/profile route. Functionality merged into handle_admin_profile.

@app.route('/api/admin-profile', methods=['GET', 'PUT'])
@jwt_required()
def handle_admin_profile():
    profile = AdminProfile.query.first()
    if not profile: # Initialize profile if it doesn't exist
        profile = AdminProfile(bio="Default bio.", image_url=None)
        db.session.add(profile)
        db.session.commit()
        # Re-fetch to ensure we have the ID if it was just created
        profile = AdminProfile.query.first()


    if request.method == 'GET':
        return jsonify(profile.to_dict())
    elif request.method == 'PUT':
        # For PUT, admin must be authenticated (already handled by @jwt_required)
        # request.form for text fields, request.files for files
        profile.bio = request.form.get('bio', profile.bio)
        
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '' and allowed_file(file.filename):
                original_filename = secure_filename(file.filename)
                unique_suffix = uuid.uuid4().hex[:8]
                supabase_path = f"profile_images/admin_{unique_suffix}_{original_filename}"
                try:
                    file.seek(0)
                    supabase_client.storage.from_(BUCKET_NAME).upload(
                        path=supabase_path,
                        file=file.read(),
                        file_options={"content-type": file.content_type, "cache-control": "3600", "upsert": "true"} # Upsert true for profile pic
                    )
                    public_url = supabase_client.storage.from_(BUCKET_NAME).get_public_url(supabase_path)
                    profile.image_url = public_url
                except Exception as e:
                    logger.error(f"Error uploading admin profile image to Supabase: {str(e)}")
                    # Decide if this error should halt the request or just be logged
                    # For now, we'll log and continue, old image_url will persist if upload fails
            elif file and file.filename != '': # File provided but not allowed type
                logger.warning(f"Admin profile image upload: File type not allowed for {file.filename}")
                # Optionally return an error: return jsonify({'error': 'Profile image file type not allowed'}), 400

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            logger.error(f"Database error updating admin profile: {str(e)}")
            return jsonify({"error": "Failed to update profile due to database error"}), 500
            
        return jsonify({"message": "Profile updated successfully", "profile": profile.to_dict()}), 200

@app.route('/api/about', methods=['GET']) # Public endpoint for about page
def get_about():
    profile = AdminProfile.query.first()
    if not profile:
        # Provide default or indicate not found, rather than 404 for a public page part
        return jsonify({"bio": "Site owner biography coming soon.", "image_url": None}), 200
    return jsonify(profile.to_dict())


@app.route('/api/upload/service/<int:service_id>', methods=['POST'])
@jwt_required()
def upload_service_image(service_id):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        unique_suffix = uuid.uuid4().hex[:8]
        supabase_path = f"service_images/service_{service_id}_{unique_suffix}_{original_filename}"
        
        try:
            file.seek(0)
            supabase_client.storage.from_(BUCKET_NAME).upload(
                path=supabase_path,
                file=file.read(),
                file_options={"content-type": file.content_type, "cache-control": "3600", "upsert": "false"}
            )
            public_url = supabase_client.storage.from_(BUCKET_NAME).get_public_url(supabase_path)
        except Exception as e:
            logger.error(f"Error uploading service image to Supabase: {str(e)}")
            return jsonify({'error': f'Failed to upload service image: {str(e)}'}), 500
        
        service = Service.query.get(service_id)
        if service:
            service.image_url = public_url
            try:
                db.session.commit()
            except Exception as e:
                logger.error(f"Database error after Supabase service image upload: {str(e)}")
                return jsonify({'error': 'Database error after file upload'}), 500
            return jsonify({'message': 'File uploaded successfully', 'path': service.image_url}), 200
        else:
            try:
                supabase_client.storage.from_(BUCKET_NAME).remove([supabase_path])
            except Exception as e_remove:
                logger.error(f"Failed to remove orphaned service file from Supabase: {supabase_path}, error: {str(e_remove)}")
            return jsonify({'error': 'Service not found'}), 404
    
    return jsonify({'error': 'File type not allowed'}), 400

# The old /api/uploads/<path:folder>/<path:filename> route and uploaded_file function are removed.
# Files are now served directly from Supabase public URLs.

# Vercel entry point (app is the Flask app instance)
# No app.run() needed for serverless deployment
