"""View layer — HTTP routes for colleges."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from decorators import role_required
from services.college_service import CollegeService

college_bp = Blueprint('colleges', __name__, url_prefix='/api/colleges')


@college_bp.route('', methods=['GET'])
def list_colleges():
    filters = {
        'search': request.args.get('search', ''),
        'location': request.args.get('location', ''),
        'course': request.args.get('course', ''),
        'max_fees': request.args.get('max_fees', type=int),
        'min_rating': request.args.get('min_rating', type=float),
        'stream': request.args.get('stream', '') or None,
        'institution_type': request.args.get('institution_type', '') or None,
    }
    body, status = CollegeService.list_colleges(filters)
    return jsonify(body), status


@college_bp.route('/filters', methods=['GET'])
def get_filters():
    body, status = CollegeService.get_filters()
    return jsonify(body), status


@college_bp.route('/<int:college_id>', methods=['GET'])
def get_college(college_id):
    body, status = CollegeService.get_college(college_id)
    return jsonify(body), status


@college_bp.route('/<int:college_id>/similar', methods=['GET'])
def get_similar(college_id):
    body, status = CollegeService.get_similar(college_id)
    return jsonify(body), status


@college_bp.route('', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def create_college():
    body, status = CollegeService.create(request.get_json())
    return jsonify(body), status


@college_bp.route('/<int:college_id>', methods=['PUT'])
@jwt_required()
@role_required(['admin'])
def update_college(college_id):
    body, status = CollegeService.update(college_id, request.get_json())
    return jsonify(body), status


@college_bp.route('/<int:college_id>', methods=['DELETE'])
@jwt_required()
@role_required(['admin'])
def delete_college(college_id):
    body, status = CollegeService.delete(college_id)
    return jsonify(body), status
