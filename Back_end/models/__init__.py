"""Model layer — database entities and serialization."""
import datetime
import bcrypt
from extensions import db

__all__ = ['db', 'User', 'College', 'Cutoff', 'Review', 'SavedCollege']


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    expecting_type = db.Column(db.String(20), nullable=True)
    field_of_interest = db.Column(db.String(50), nullable=True)
    profile_icon = db.Column(db.String(50), default='user', nullable=True)
    role = db.Column(db.String(20), default='user', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    saved_colleges = db.relationship(
        'SavedCollege', backref='user', lazy=True, cascade='all, delete-orphan'
    )

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'expecting_type': self.expecting_type,
            'field_of_interest': self.field_of_interest,
            'profile_icon': self.profile_icon or 'user',
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class College(db.Model):
    __tablename__ = 'colleges'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    fees = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Float, default=0.0)
    courses = db.Column(db.Text, nullable=False)
    placements_pct = db.Column(db.Float, default=0.0)
    package_median = db.Column(db.Float, default=0.0)
    package_highest = db.Column(db.Float, default=0.0)
    description = db.Column(db.Text, nullable=True)
    logo_url = db.Column(db.String(500), nullable=True)
    stream = db.Column(db.String(50), default='Engineering', nullable=True)
    institution_type = db.Column(db.String(20), default='College', nullable=True)

    cutoffs = db.relationship('Cutoff', backref='college', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='college', lazy=True, cascade='all, delete-orphan')
    saved_by = db.relationship('SavedCollege', backref='college', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, include_details=False):
        data = {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'fees': self.fees,
            'rating': self.rating,
            'courses': [c.strip() for c in self.courses.split(',') if c.strip()],
            'placements_pct': self.placements_pct,
            'package_median': self.package_median,
            'package_highest': self.package_highest,
            'logo_url': self.logo_url,
            'stream': self.stream or 'Engineering',
            'institution_type': self.institution_type or 'College',
        }
        if include_details:
            data['description'] = self.description
            data['reviews'] = [r.to_dict() for r in self.reviews]
            data['cutoffs'] = [c.to_dict() for c in self.cutoffs]
        return data


class Cutoff(db.Model):
    __tablename__ = 'cutoffs'

    id = db.Column(db.Integer, primary_key=True)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'), nullable=False)
    exam = db.Column(db.String(50), nullable=False)
    branch = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), default='General')
    min_rank = db.Column(db.Integer, default=1)
    max_rank = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'college_name': self.college.name if self.college else '',
            'exam': self.exam,
            'branch': self.branch,
            'category': self.category,
            'min_rank': self.min_rank,
            'max_rank': self.max_rank,
        }


class SavedCollege(db.Model):
    __tablename__ = 'saved_colleges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'college_id', name='_user_college_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'college_id': self.college_id,
            'college': self.college.to_dict() if self.college else None,
        }


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    college_id = db.Column(db.Integer, db.ForeignKey('colleges.id'), nullable=False)
    reviewer_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'college_id': self.college_id,
            'reviewer_name': self.reviewer_name,
            'rating': self.rating,
            'text': self.text,
            'created_at': self.created_at.strftime('%Y-%m-%d'),
        }
