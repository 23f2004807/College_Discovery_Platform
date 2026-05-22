from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, College, Cutoff, Review, SavedCollege
from config import Config
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize DB & JWT
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Auth Endpoints
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'user') # Defaults to 'user'
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
            
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email already registered'}), 400
            
        user = User(email=email, role=role)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Auto-login after registration
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Registration successful',
            'token': access_token,
            'user': user.to_dict()
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
            
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'message': 'Invalid email or password'}), 401
            
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': user.to_dict()
        }), 200

    @app.route('/api/auth/me', methods=['GET'])
    @jwt_required()
    def get_me():
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200

    # Colleges CRUD & Listing Endpoints
    @app.route('/api/colleges', methods=['GET'])
    def list_colleges():
        # Get query parameters
        search = request.args.get('search', '')
        location = request.args.get('location', '')
        course = request.args.get('course', '')
        max_fees = request.args.get('max_fees', type=int)
        min_rating = request.args.get('min_rating', type=float)
        
        query = College.query
        
        if search:
            query = query.filter(College.name.ilike(f'%{search}%'))
        if location:
            query = query.filter(College.location.ilike(f'%{location}%'))
        if course:
            query = query.filter(College.courses.ilike(f'%{course}%'))
        if max_fees is not None:
            query = query.filter(College.fees <= max_fees)
        if min_rating is not None:
            query = query.filter(College.rating >= min_rating)
            
        colleges = query.all()
        return jsonify([c.to_dict() for c in colleges]), 200

    @app.route('/api/colleges/<int:college_id>', methods=['GET'])
    def get_college(college_id):
        college = College.query.get_or_456 = College.query.get(college_id)
        if not college:
            return jsonify({'message': 'College not found'}), 404
        return jsonify(college.to_dict(include_details=True)), 200

    # Admin Protected Create
    @app.route('/api/colleges', methods=['POST'])
    @jwt_required()
    def create_college():
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized. Admin access required.'}), 403
            
        data = request.get_json()
        name = data.get('name')
        location = data.get('location')
        fees = data.get('fees', 0)
        rating = data.get('rating', 0.0)
        courses = data.get('courses', '')
        placements_pct = data.get('placements_pct', 0.0)
        package_median = data.get('package_median', 0.0)
        package_highest = data.get('package_highest', 0.0)
        description = data.get('description', '')
        logo_url = data.get('logo_url', '')
        
        if not name or not location:
            return jsonify({'message': 'College name and location are required'}), 400
            
        college = College(
            name=name, location=location, fees=fees, rating=rating,
            courses=courses, placements_pct=placements_pct,
            package_median=package_median, package_highest=package_highest,
            description=description, logo_url=logo_url
        )
        db.session.add(college)
        db.session.flush()
        
        # Optionally handle cutoffs if sent in JSON
        cutoffs = data.get('cutoffs', [])
        for c in cutoffs:
            cutoff = Cutoff(
                college_id=college.id,
                exam=c.get('exam'),
                branch=c.get('branch'),
                category=c.get('category', 'General'),
                min_rank=c.get('min_rank', 1),
                max_rank=c.get('max_rank')
            )
            db.session.add(cutoff)
            
        db.session.commit()
        return jsonify(college.to_dict(include_details=True)), 201

    # Admin Protected Update
    @app.route('/api/colleges/<int:college_id>', methods=['PUT'])
    @jwt_required()
    def update_college(college_id):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized. Admin access required.'}), 403
            
        college = College.query.get(college_id)
        if not college:
            return jsonify({'message': 'College not found'}), 404
            
        data = request.get_json()
        college.name = data.get('name', college.name)
        college.location = data.get('location', college.location)
        college.fees = data.get('fees', college.fees)
        college.rating = data.get('rating', college.rating)
        college.courses = data.get('courses', college.courses)
        college.placements_pct = data.get('placements_pct', college.placements_pct)
        college.package_median = data.get('package_median', college.package_median)
        college.package_highest = data.get('package_highest', college.package_highest)
        college.description = data.get('description', college.description)
        college.logo_url = data.get('logo_url', college.logo_url)
        
        # Remove old cutoffs and add new ones if provided
        if 'cutoffs' in data:
            Cutoff.query.filter_by(college_id=college.id).delete()
            for c in data['cutoffs']:
                cutoff = Cutoff(
                    college_id=college.id,
                    exam=c.get('exam'),
                    branch=c.get('branch'),
                    category=c.get('category', 'General'),
                    min_rank=c.get('min_rank', 1),
                    max_rank=c.get('max_rank')
                )
                db.session.add(cutoff)
                
        db.session.commit()
        return jsonify(college.to_dict(include_details=True)), 200

    # Admin Protected Delete
    @app.route('/api/colleges/<int:college_id>', methods=['DELETE'])
    @jwt_required()
    def delete_college(college_id):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or user.role != 'admin':
            return jsonify({'message': 'Unauthorized. Admin access required.'}), 403
            
        college = College.query.get(college_id)
        if not college:
            return jsonify({'message': 'College not found'}), 404
            
        db.session.delete(college)
        db.session.commit()
        return jsonify({'message': 'College deleted successfully'}), 200

    # Reviews Endpoints
    @app.route('/api/colleges/<int:college_id>/reviews', methods=['POST'])
    def add_review(college_id):
        college = College.query.get(college_id)
        if not college:
            return jsonify({'message': 'College not found'}), 404
            
        data = request.get_json()
        reviewer_name = data.get('reviewer_name')
        rating = data.get('rating', 0.0)
        text = data.get('text')
        
        if not reviewer_name or not text:
            return jsonify({'message': 'Reviewer name and comment text are required'}), 400
            
        review = Review(
            college_id=college_id,
            reviewer_name=reviewer_name,
            rating=rating,
            text=text
        )
        db.session.add(review)
        
        # Recompute average rating for college
        all_reviews = Review.query.filter_by(college_id=college_id).all()
        avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else rating
        college.rating = round(avg_rating, 2)
        
        db.session.commit()
        return jsonify(review.to_dict()), 201

    # Predictor Endpoint
    @app.route('/api/predict', methods=['GET'])
    def predict_college():
        rank = request.args.get('rank', type=int)
        exam = request.args.get('exam', '') # e.g. "JEE Main", "JEE Advanced", "BITSAT"
        
        if not rank or not exam:
            return jsonify({'message': 'Rank and Exam type are required parameters'}), 400
            
        # Select cutoffs where closing rank >= rank
        # i.e., the user's rank is better than or equal to the closing cutoff rank (smaller rank is better, but cutoffs are max allowed ranks)
        # In Indian context: closing rank of 10000 means ranks 1 to 10000 can get in.
        # So we query: Cutoff.max_rank >= rank (meaning user rank is within/under the maximum threshold).
        eligible_cutoffs = Cutoff.query.filter(
            Cutoff.exam.ilike(f'%{exam}%'),
            Cutoff.max_rank >= rank
        ).order_by(Cutoff.max_rank.asc()).all()
        
        results = []
        for cutoff in eligible_cutoffs:
            col_dict = cutoff.college.to_dict()
            results.append({
                'college_id': cutoff.college_id,
                'college_name': cutoff.college.name,
                'branch': cutoff.branch,
                'exam': cutoff.exam,
                'cutoff_rank': cutoff.max_rank,
                'fees': col_dict['fees'],
                'rating': col_dict['rating'],
                'location': col_dict['location'],
                'logo_url': col_dict['logo_url']
            })
            
        return jsonify(results), 200

    # Saved Colleges endpoints
    @app.route('/api/saved', methods=['GET'])
    @jwt_required()
    def get_saved():
        user_id = get_jwt_identity()
        saved = SavedCollege.query.filter_by(user_id=int(user_id)).all()
        return jsonify([s.to_dict() for s in saved]), 200

    @app.route('/api/saved/toggle', methods=['POST'])
    @jwt_required()
    def toggle_saved():
        user_id = get_jwt_identity()
        data = request.get_json()
        college_id = data.get('college_id')
        
        if not college_id:
            return jsonify({'message': 'College ID is required'}), 400
            
        saved_item = SavedCollege.query.filter_by(user_id=int(user_id), college_id=college_id).first()
        if saved_item:
            db.session.delete(saved_item)
            db.session.commit()
            return jsonify({'saved': False, 'message': 'Removed from saved list'}), 200
        else:
            college = College.query.get(college_id)
            if not college:
                return jsonify({'message': 'College not found'}), 404
            new_saved = SavedCollege(user_id=int(user_id), college_id=college_id)
            db.session.add(new_saved)
            db.session.commit()
            return jsonify({'saved': True, 'message': 'Added to saved list'}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
