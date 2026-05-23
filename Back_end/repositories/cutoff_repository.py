from models import Cutoff, College

# Exams where a higher entered value is better (score / percentage)
SCORE_BASED_EXAM_KEYWORDS = ('BITSAT', 'CBSE', 'ICSE', 'School Aptitude', 'ISC Entrance')


def is_score_based_exam(exam_name):
    exam_upper = (exam_name or '').upper()
    return any(keyword.upper() in exam_upper for keyword in SCORE_BASED_EXAM_KEYWORDS)


class CutoffRepository:
    @staticmethod
    def count():
        return Cutoff.query.count()

    @staticmethod
    def list_distinct_exams():
        rows = (
            Cutoff.query.with_entities(Cutoff.exam)
            .distinct()
            .order_by(Cutoff.exam.asc())
            .all()
        )
        return [row[0] for row in rows]

    @staticmethod
    def find_eligible(exam, value, stream=None, institution_type=None, input_mode=None):
        """
        input_mode 'rank': lower rank is better — eligible if user rank <= closing rank (max_rank).
        input_mode 'score': higher score/% is better — eligible if user value >= minimum cutoff (min_rank).
        If input_mode is omitted, falls back to exam-name heuristics.
        """
        query = Cutoff.query.join(College, Cutoff.college_id == College.id).filter(
            Cutoff.exam.ilike(f'%{exam}%'),
        )

        if stream:
            query = query.filter(College.stream == stream)
        if institution_type:
            query = query.filter(College.institution_type == institution_type)

        use_score_mode = (
            input_mode == 'score'
            if input_mode in ('rank', 'score')
            else is_score_based_exam(exam)
        )

        if use_score_mode:
            query = query.filter(Cutoff.min_rank <= value)
            return query.order_by(Cutoff.min_rank.desc()).all()

        query = query.filter(Cutoff.max_rank >= value)
        return query.order_by(Cutoff.max_rank.asc()).all()
