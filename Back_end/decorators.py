from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models import User


def role_required(roles):
    """Decorator to check if user has required role. Use after @jwt_required()."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            if not current_user_id:
                return jsonify({'message': 'Authentication required'}), 401

            user = User.query.get(int(current_user_id))
            if not user or user.role not in roles:
                return jsonify({'message': 'Insufficient permissions'}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator
