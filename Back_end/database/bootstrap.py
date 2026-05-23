"""
Database bootstrap — runs on every app start.
Ensures tables exist, default admin/user accounts, and college seed data in DB.
"""
from sqlalchemy import inspect, text

from extensions import db
from models import User, College, Cutoff, Review
from seed_data.colleges_seed_data import COLLEGES_SEED_DATA

# Default credentials (created automatically if missing)
DEFAULT_ADMIN = {
    'email': 'admin@college.com',
    'password': 'AdminPass123!',
    'role': 'admin',
    'full_name': 'System Administrator',
}

DEFAULT_USER = {
    'email': 'user@college.com',
    'password': 'UserPass123!',
    'role': 'user',
    'full_name': 'Test Student',
    'phone': '9876543210',
    'expecting_type': 'College',
    'field_of_interest': 'Engineering',
}

USER_COLUMNS = [
    ('full_name', 'VARCHAR(120)'),
    ('phone', 'VARCHAR(20)'),
    ('expecting_type', 'VARCHAR(20)'),
    ('field_of_interest', 'VARCHAR(50)'),
    ('profile_icon', 'VARCHAR(50)'),
]

COLLEGE_COLUMNS = [
    ('stream', 'VARCHAR(50)'),
    ('institution_type', 'VARCHAR(20)'),
]


def migrate_college_columns():
    insp = inspect(db.engine)
    if 'colleges' not in insp.get_table_names():
        return
    existing = {c['name'] for c in insp.get_columns('colleges')}
    for col_name, col_type in COLLEGE_COLUMNS:
        if col_name in existing:
            continue
        db.session.execute(text(f'ALTER TABLE colleges ADD COLUMN {col_name} {col_type}'))
    db.session.commit()


def backfill_college_metadata():
    """Set stream/type on legacy rows that predate the new columns."""
    updated = False
    for college in College.query.all():
        if not college.stream:
            college.stream = 'Engineering'
            updated = True
        if not college.institution_type:
            college.institution_type = 'College'
            updated = True
    if updated:
        db.session.commit()


def migrate_user_columns():
    insp = inspect(db.engine)
    if 'users' not in insp.get_table_names():
        return
    existing = {c['name'] for c in insp.get_columns('users')}
    for col_name, col_type in USER_COLUMNS:
        if col_name in existing:
            continue
        db.session.execute(text(f'ALTER TABLE users ADD COLUMN {col_name} {col_type}'))
    db.session.commit()


def _create_user_if_missing(spec):
    user = User.query.filter_by(email=spec['email']).first()
    if user:
        return user
    user = User(
        email=spec['email'],
        role=spec['role'],
        full_name=spec.get('full_name'),
        phone=spec.get('phone'),
        expecting_type=spec.get('expecting_type'),
        field_of_interest=spec.get('field_of_interest'),
    )
    user.set_password(spec['password'])
    db.session.add(user)
    db.session.commit()
    print(f'[bootstrap] Created {spec["role"]} account: {spec["email"]}')
    return user


def ensure_default_users():
    """Always ensure admin and demo user exist in the database."""
    _create_user_if_missing(DEFAULT_ADMIN)
    _create_user_if_missing(DEFAULT_USER)


def _insert_colleges_from_seed(seed_records=None):
    records = seed_records if seed_records is not None else COLLEGES_SEED_DATA
    for c_data in records:
        college = College(
            name=c_data['name'],
            location=c_data['location'],
            fees=c_data['fees'],
            rating=c_data['rating'],
            courses=c_data['courses'],
            placements_pct=c_data['placements_pct'],
            package_median=c_data['package_median'],
            package_highest=c_data['package_highest'],
            logo_url=c_data.get('logo_url'),
            description=c_data['description'],
            stream=c_data.get('stream', 'Engineering'),
            institution_type=c_data.get('institution_type', 'College'),
        )
        db.session.add(college)
        db.session.flush()

        for cutoff_data in c_data.get('cutoffs', []):
            db.session.add(Cutoff(
                college_id=college.id,
                exam=cutoff_data['exam'],
                branch=cutoff_data['branch'],
                category=cutoff_data.get('category', 'General'),
                min_rank=cutoff_data.get('min_rank', 1),
                max_rank=cutoff_data['max_rank'],
            ))

        for rev_data in c_data.get('reviews', []):
            db.session.add(Review(
                college_id=college.id,
                reviewer_name=rev_data['reviewer_name'],
                rating=rev_data['rating'],
                text=rev_data['text'],
            ))

    db.session.commit()


def seed_colleges_if_empty():
    """Load all college seed data into DB only when colleges table is empty."""
    if College.query.count() > 0:
        return
    print(f'[bootstrap] Seeding {len(COLLEGES_SEED_DATA)} institutions into database...')
    _insert_colleges_from_seed()
    print('[bootstrap] College seed data loaded.')


def seed_missing_colleges():
    """Insert any seed records not yet present (by institution name)."""
    existing_names = {c.name for c in College.query.all()}
    missing = [c for c in COLLEGES_SEED_DATA if c['name'] not in existing_names]
    if not missing:
        return
    print(f'[bootstrap] Adding {len(missing)} new institution(s) from seed data...')
    _insert_colleges_from_seed(missing)
    print('[bootstrap] Additional seed institutions loaded.')


def initialize_database():
    """Called when Flask app is created — safe to run every startup."""
    db.create_all()
    migrate_user_columns()
    migrate_college_columns()
    ensure_default_users()
    seed_colleges_if_empty()
    backfill_college_metadata()
    seed_missing_colleges()


def reset_and_seed_database():
    """Destructive full reset — use only via `python seeds.py`."""
    print('Resetting database and re-seeding...')
    db.drop_all()
    db.create_all()
    migrate_user_columns()
    migrate_college_columns()
    ensure_default_users()
    _insert_colleges_from_seed()
    print('Database reset complete.')
