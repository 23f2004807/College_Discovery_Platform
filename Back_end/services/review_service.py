from models import Review
from repositories.college_repository import CollegeRepository
from repositories.review_repository import ReviewRepository
from repositories.user_repository import UserRepository


class ReviewService:
    @staticmethod
    def add_review(college_id, user_id, data):
        college = CollegeRepository.find_by_id(college_id)
        if not college:
            return {'message': 'College not found'}, 404

        user = UserRepository.find_by_id(user_id)
        reviewer_name = data.get('reviewer_name') or (
            user.email.split('@')[0] if user else 'Anonymous'
        )
        rating = data.get('rating', 0.0)
        text = data.get('text')

        if not text:
            return {'message': 'Review text is required'}, 400

        review = Review(
            college_id=college_id,
            reviewer_name=reviewer_name,
            rating=rating,
            text=text,
        )
        ReviewRepository.create(review)

        all_reviews = ReviewRepository.find_by_college(college_id)
        avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else rating
        college.rating = round(avg_rating, 2)
        from extensions import db
        db.session.commit()

        return review.to_dict(), 201
