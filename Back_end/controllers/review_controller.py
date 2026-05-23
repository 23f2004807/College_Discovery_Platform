"""View layer — HTTP routes for reviews."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.review_service import ReviewService

review_bp = Blueprint('reviews', __name__, url_prefix='/api/colleges')


@review_bp.route('/<int:college_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(college_id):
    body, status = ReviewService.add_review(college_id, get_jwt_identity(), request.get_json())
    return jsonify(body), status
