from repositories.saved_repository import SavedRepository


class SavedService:
    @staticmethod
    def list_saved(user_id):
        saved = SavedRepository.find_by_user(user_id)
        return [s.to_dict() for s in saved], 200

    @staticmethod
    def toggle(user_id, college_id):
        if not college_id:
            return {'message': 'College ID is required'}, 400

        saved_item = SavedRepository.find_one(user_id, college_id)
        if saved_item:
            SavedRepository.delete(saved_item)
            return {'saved': False, 'message': 'Removed from saved list'}, 200

        if not SavedRepository.college_exists(college_id):
            return {'message': 'College not found'}, 404

        SavedRepository.create(user_id, college_id)
        return {'saved': True, 'message': 'Added to saved list'}, 200
