from extensions import db
from models import SavedCollege, College


class SavedRepository:
    @staticmethod
    def find_by_user(user_id):
        return SavedCollege.query.filter_by(user_id=int(user_id)).all()

    @staticmethod
    def find_one(user_id, college_id):
        return SavedCollege.query.filter_by(
            user_id=int(user_id), college_id=college_id
        ).first()

    @staticmethod
    def delete(saved_item):
        db.session.delete(saved_item)
        db.session.commit()

    @staticmethod
    def create(user_id, college_id):
        item = SavedCollege(user_id=int(user_id), college_id=college_id)
        db.session.add(item)
        db.session.commit()
        return item

    @staticmethod
    def college_exists(college_id):
        return College.query.get(college_id) is not None
