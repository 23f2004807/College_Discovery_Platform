"""
Full database reset + re-seed (destructive).
Usage: python seeds.py

For normal startup seeding, the app runs database/bootstrap.py automatically.
"""
from app import create_app
from database.bootstrap import reset_and_seed_database

if __name__ == '__main__':
    app = create_app(bootstrap=False)
    with app.app_context():
        reset_and_seed_database()
