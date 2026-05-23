"""View layer — HTTP routes for platform statistics."""
from flask import Blueprint, jsonify
from services.stats_service import StatsService

stats_bp = Blueprint('stats', __name__, url_prefix='/api')


@stats_bp.route('/stats', methods=['GET'])
def platform_stats():
    body, status = StatsService.platform_stats()
    return jsonify(body), status
