import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key_1293847293847293')
    
    # SQLite Database setup
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f'sqlite:///{os.path.join(BASE_DIR, "college_discovery.db")}'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Extended config
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev_jwt_secret_key_098123098123')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # CORS Config
    CORS_HEADERS = 'Content-Type'
