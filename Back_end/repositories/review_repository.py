from extensions import db
from models import Review


class ReviewRepository:
    @staticmethod
    def create(review):
        db.session.add(review)
        db.session.commit()
        return review

    @staticmethod
    def find_by_college(college_id):
        return Review.query.filter_by(college_id=college_id).all()
