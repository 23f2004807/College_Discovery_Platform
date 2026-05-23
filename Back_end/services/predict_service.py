from repositories.cutoff_repository import CutoffRepository, is_score_based_exam
from repositories.user_repository import UserRepository


def _exam_input_meta(name):
    score_default = is_score_based_exam(name)
    return {
        'name': name,
        'default_input_mode': 'score' if score_default else 'rank',
        'supports_rank': True,
        'supports_score': True,
        'rank_label': 'All India Rank (AIR)',
        'score_label': (
            'Cutoff score / percentage'
            if any(k in name for k in ('CBSE', 'ICSE', 'School'))
            else 'Cutoff score / marks'
        ),
        'rank_placeholder': 'e.g. 5000',
        'score_placeholder': (
            'e.g. 92'
            if any(k in name for k in ('CBSE', 'ICSE', 'School'))
            else 'e.g. 290'
        ),
    }


class PredictService:
    @staticmethod
    def list_exams():
        exams = [_exam_input_meta(name) for name in CutoffRepository.list_distinct_exams()]
        return {'exams': exams}, 200

    @staticmethod
    def predict(value, exam, user_id=None, match_profile=True, input_mode=None):
        if value is None or not exam:
            return {'message': 'Rank/score and exam are required parameters'}, 400

        if value <= 0:
            return {'message': 'Please enter a valid rank or score greater than zero'}, 400

        if input_mode and input_mode not in ('rank', 'score'):
            return {'message': 'input_mode must be rank or score'}, 400

        use_score = (
            input_mode == 'score'
            if input_mode in ('rank', 'score')
            else is_score_based_exam(exam)
        )

        stream = None
        institution_type = None

        if user_id and match_profile:
            user = UserRepository.find_by_id(user_id)
            if user:
                stream = user.field_of_interest
                institution_type = user.expecting_type

        eligible = CutoffRepository.find_eligible(
            exam=exam,
            value=value,
            stream=stream,
            institution_type=institution_type,
            input_mode=input_mode or ('score' if use_score else 'rank'),
        )

        results = []
        for cutoff in eligible:
            col_dict = cutoff.college.to_dict()
            closing = cutoff.min_rank if use_score else cutoff.max_rank
            results.append({
                'college_id': cutoff.college_id,
                'college_name': cutoff.college.name,
                'branch': cutoff.branch,
                'exam': cutoff.exam,
                'category': cutoff.category,
                'cutoff_rank': closing,
                'cutoff_min': cutoff.min_rank,
                'cutoff_max': cutoff.max_rank,
                'fees': col_dict['fees'],
                'rating': col_dict['rating'],
                'location': col_dict['location'],
                'logo_url': col_dict['logo_url'],
                'stream': col_dict.get('stream'),
                'institution_type': col_dict.get('institution_type'),
            })

        payload = {
            'results': results,
            'count': len(results),
            'exam': exam,
            'entered_value': value,
            'input_mode': 'score' if use_score else 'rank',
        }

        if stream:
            payload['filtered_by'] = {
                'stream': stream,
                'institution_type': institution_type,
            }

        return payload, 200
