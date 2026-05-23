"""
Initialize database (tables + seed data).
Usage: python init_db.py
"""
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from models import College
from database.bootstrap import initialize_database

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        count = College.query.count()
        print(f'Database ready. Colleges in DB: {count}')
