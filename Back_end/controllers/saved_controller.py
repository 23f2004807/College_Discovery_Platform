"""View layer — HTTP routes for saved colleges."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.saved_service import SavedService

saved_bp = Blueprint('saved', __name__, url_prefix='/api/saved')


@saved_bp.route('', methods=['GET'])
@jwt_required()
def get_saved():
    body, status = SavedService.list_saved(get_jwt_identity())
    return jsonify(body), status


@saved_bp.route('/toggle', methods=['POST'])
@jwt_required()
def toggle_saved():
    college_id = (request.get_json() or {}).get('college_id')
    body, status = SavedService.toggle(get_jwt_identity(), college_id)
    return jsonify(body), status
