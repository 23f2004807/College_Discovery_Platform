from models import College
from repositories.college_repository import CollegeRepository


class CollegeService:
    @staticmethod
    def list_colleges(filters):
        colleges = CollegeRepository.list_filtered(
            search=filters.get('search', ''),
            location=filters.get('location', ''),
            course=filters.get('course', ''),
            max_fees=filters.get('max_fees'),
            min_rating=filters.get('min_rating'),
            stream=filters.get('stream'),
            institution_type=filters.get('institution_type'),
        )
        return [c.to_dict() for c in colleges], 200

    @staticmethod
    def get_college(college_id):
        college = CollegeRepository.find_by_id(college_id)
        if not college:
            return {'message': 'College not found'}, 404
        return college.to_dict(include_details=True), 200

    @staticmethod
    def get_filters():
        colleges = CollegeRepository.find_all()
        locations = sorted(set(
            c.location.split(',')[0].strip() for c in colleges if c.location
        ))
        course_set = set()
        for c in colleges:
            for course in c.courses.split(','):
                course = course.strip()
                if course:
                    course_set.add(course)
        streams = sorted(set(c.stream for c in colleges if c.stream))
        institution_types = sorted(set(c.institution_type for c in colleges if c.institution_type))
        return {
            'locations': locations,
            'courses': sorted(course_set),
            'streams': streams,
            'institution_types': institution_types,
        }, 200

    @staticmethod
    def get_similar(college_id):
        college = CollegeRepository.find_by_id(college_id)
        if not college:
            return {'message': 'College not found'}, 404
        similar = CollegeRepository.find_similar(college_id, college)
        return [c.to_dict() for c in similar], 200

    @staticmethod
    def create(data):
        name = data.get('name')
        location = data.get('location')
        if not name or not location:
            return {'message': 'College name and location are required'}, 400

        college = College(
            name=name,
            location=location,
            fees=data.get('fees', 0),
            rating=data.get('rating', 0.0),
            courses=data.get('courses', ''),
            placements_pct=data.get('placements_pct', 0.0),
            package_median=data.get('package_median', 0.0),
            package_highest=data.get('package_highest', 0.0),
            description=data.get('description', ''),
            logo_url=data.get('logo_url', ''),
            stream=data.get('stream', 'Engineering'),
            institution_type=data.get('institution_type', 'College'),
        )
        CollegeRepository.create(college, data.get('cutoffs', []))
        return college.to_dict(include_details=True), 201

    @staticmethod
    def update(college_id, data):
        college = CollegeRepository.find_by_id(college_id)
        if not college:
            return {'message': 'College not found'}, 404
        CollegeRepository.update(college, data)
        return college.to_dict(include_details=True), 200

    @staticmethod
    def delete(college_id):
        college = CollegeRepository.find_by_id(college_id)
        if not college:
            return {'message': 'College not found'}, 404
        CollegeRepository.delete(college)
        return {'message': 'College deleted successfully'}, 200
