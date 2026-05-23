import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

_BASE_DIR = os.path.abspath(os.path.dirname(__file__))
_DEFAULT_PG = 'postgresql://postgres:postgres@localhost:5432/campus_discovery'
_SQLITE_URI = f'sqlite:///{os.path.join(_BASE_DIR, "college_discovery.db")}'


def _resolve_database_uri():
    if os.environ.get('USE_SQLITE', '').lower() == 'true':
        return _SQLITE_URI
    db_url = os.environ.get('DATABASE_URL', _DEFAULT_PG)
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    if db_url.startswith('postgresql'):
        try:
            import psycopg2  # noqa: F401
        except ImportError:
            print(
                '[config] psycopg2 not installed — using SQLite.\n'
                '  Fix: pip install psycopg2-binary  OR  set USE_SQLITE=true in .env'
            )
            return _SQLITE_URI
    return db_url


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key_1293847293847293')
    SQLALCHEMY_DATABASE_URI = _resolve_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_pre_ping': True}

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev_jwt_secret_key_098123098123')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    CORS_HEADERS = 'Content-Type'
