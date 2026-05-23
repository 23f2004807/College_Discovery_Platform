from repositories.college_repository import CollegeRepository
from repositories.cutoff_repository import CutoffRepository


class StatsService:
    @staticmethod
    def platform_stats():
        colleges = CollegeRepository.find_all()
        avg_placement = (
            sum(c.placements_pct for c in colleges) / len(colleges) if colleges else 0
        )
        return {
            'college_count': CollegeRepository.count(),
            'cutoff_count': CutoffRepository.count(),
            'avg_placement_pct': round(avg_placement, 1),
        }, 200
