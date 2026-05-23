from extensions import db
from models import College, Cutoff


class CollegeRepository:
    @staticmethod
    def find_by_id(college_id):
        return College.query.get(college_id)

    @staticmethod
    def list_filtered(
        search='',
        location='',
        course='',
        max_fees=None,
        min_rating=None,
        stream=None,
        institution_type=None,
    ):
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
        if stream:
            query = query.filter(College.stream == stream)
        if institution_type:
            query = query.filter(College.institution_type == institution_type)
        return query.all()

    @staticmethod
    def find_all():
        return College.query.all()

    @staticmethod
    def count():
        return College.query.count()

    @staticmethod
    def create(college, cutoffs_data=None):
        db.session.add(college)
        db.session.flush()
        if cutoffs_data:
            for c in cutoffs_data:
                db.session.add(Cutoff(
                    college_id=college.id,
                    exam=c.get('exam'),
                    branch=c.get('branch'),
                    category=c.get('category', 'General'),
                    min_rank=c.get('min_rank', 1),
                    max_rank=c.get('max_rank'),
                ))
        db.session.commit()
        return college

    @staticmethod
    def update(college, data):
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
        if 'stream' in data:
            college.stream = data.get('stream', college.stream)
        if 'institution_type' in data:
            college.institution_type = data.get('institution_type', college.institution_type)
        if 'cutoffs' in data:
            Cutoff.query.filter_by(college_id=college.id).delete()
            for c in data['cutoffs']:
                db.session.add(Cutoff(
                    college_id=college.id,
                    exam=c.get('exam'),
                    branch=c.get('branch'),
                    category=c.get('category', 'General'),
                    min_rank=c.get('min_rank', 1),
                    max_rank=c.get('max_rank'),
                ))
        db.session.commit()
        return college

    @staticmethod
    def delete(college):
        db.session.delete(college)
        db.session.commit()

    @staticmethod
    def find_similar(college_id, college, limit=4):
        city = college.location.split(',')[0].strip()
        similar = College.query.filter(
            College.id != college_id,
            College.location.ilike(f'%{city}%'),
        ).limit(limit).all()
        if len(similar) < 3:
            fee_range = college.fees * 0.5
            extra = College.query.filter(
                College.id != college_id,
                College.fees.between(college.fees - fee_range, college.fees + fee_range),
            ).limit(limit - len(similar)).all()
            seen = {c.id for c in similar}
            for c in extra:
                if c.id not in seen:
                    similar.append(c)
                    seen.add(c.id)
        if len(similar) < 3:
            more = College.query.filter(College.id != college_id).order_by(
                db.func.abs(College.rating - college.rating)
            ).limit(limit - len(similar)).all()
            seen = {c.id for c in similar}
            for c in more:
                if c.id not in seen:
                    similar.append(c)
        return similar[:limit]
