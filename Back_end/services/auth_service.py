from flask_jwt_extended import create_access_token
from models import User
from repositories.user_repository import UserRepository

VALID_FIELDS = (
    'Engineering', 'Medical', 'Arts', 'Commerce', 'Science',
    'Law', 'Management', 'Design', 'Education', 'Other',
)

VALID_PROFILE_ICONS = (
    'user', 'graduation-cap', 'book-open', 'atom', 'heart',
    'star', 'rocket', 'briefcase', 'palette', 'microchip',
)


class AuthService:
    @staticmethod
    def register(data):
        email = (data or {}).get('email', '').strip()
        password = (data or {}).get('password')
        full_name = (data or {}).get('full_name', '').strip()
        phone = (data or {}).get('phone', '').strip()
        expecting_type = (data or {}).get('expecting_type', '').strip()
        field_of_interest = (data or {}).get('field_of_interest', '').strip()

        required = {
            'full_name': full_name,
            'phone': phone,
            'email': email,
            'password': password,
            'expecting_type': expecting_type,
            'field_of_interest': field_of_interest,
        }
        missing = [k for k, v in required.items() if not v]
        if missing:
            return {'message': f'Missing required fields: {", ".join(missing)}'}, 400

        if expecting_type not in ('School', 'College'):
            return {'message': 'expecting_type must be School or College'}, 400

        if field_of_interest not in VALID_FIELDS:
            return {'message': f'field_of_interest must be one of: {", ".join(VALID_FIELDS)}'}, 400

        if UserRepository.find_by_email(email):
            return {'message': 'Email already registered'}, 400

        user = User(
            email=email,
            role='user',
            full_name=full_name,
            phone=phone,
            expecting_type=expecting_type,
            field_of_interest=field_of_interest,
        )
        user.set_password(password)
        UserRepository.create(user)

        token = create_access_token(identity=str(user.id))
        return {
            'message': 'Registration successful',
            'token': token,
            'user': user.to_dict(),
        }, 201

    @staticmethod
    def login(data):
        email = (data or {}).get('email')
        password = (data or {}).get('password')
        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        user = UserRepository.find_by_email(email)
        if not user or not user.check_password(password):
            return {'message': 'Invalid email or password'}, 401

        token = create_access_token(identity=str(user.id))
        return {
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict(),
        }, 200

    @staticmethod
    def get_profile(user_id):
        user = UserRepository.find_by_id(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        return {'user': user.to_dict()}, 200

    @staticmethod
    def update_profile(user_id, data):
        user = UserRepository.find_by_id(user_id)
        if not user:
            return {'message': 'User not found'}, 404

        data = data or {}
        full_name = (data.get('full_name') or '').strip()
        phone = (data.get('phone') or '').strip()
        expecting_type = (data.get('expecting_type') or '').strip()
        field_of_interest = (data.get('field_of_interest') or '').strip()
        profile_icon = (data.get('profile_icon') or '').strip()

        missing = [k for k, v in {
            'full_name': full_name,
            'phone': phone,
            'expecting_type': expecting_type,
            'field_of_interest': field_of_interest,
        }.items() if not v]
        if missing:
            return {'message': f'Missing required fields: {", ".join(missing)}'}, 400

        if expecting_type not in ('School', 'College'):
            return {'message': 'expecting_type must be School or College'}, 400

        if field_of_interest not in VALID_FIELDS:
            return {'message': f'field_of_interest must be one of: {", ".join(VALID_FIELDS)}'}, 400

        if profile_icon and profile_icon not in VALID_PROFILE_ICONS:
            return {'message': 'Invalid profile icon'}, 400

        user.full_name = full_name
        user.phone = phone
        user.expecting_type = expecting_type
        user.field_of_interest = field_of_interest
        if profile_icon:
            user.profile_icon = profile_icon

        UserRepository.save(user)
        return {'message': 'Profile updated', 'user': user.to_dict()}, 200

    @staticmethod
    def registration_options():
        return {
            'expecting_types': ['School', 'College'],
            'fields_of_interest': list(VALID_FIELDS),
        }, 200
