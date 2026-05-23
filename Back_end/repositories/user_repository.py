from models import User


class UserRepository:
    @staticmethod
    def find_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def find_by_id(user_id):
        return User.query.get(int(user_id))

    @staticmethod
    def create(user):
        from extensions import db
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def save(user):
        from extensions import db
        db.session.commit()
        return user
