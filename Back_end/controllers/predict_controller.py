"""View layer — HTTP routes for admission predictor."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.predict_service import PredictService

predict_bp = Blueprint('predict', __name__, url_prefix='/api')


@predict_bp.route('/predict/exams', methods=['GET'])
@jwt_required()
def list_exams():
    body, status = PredictService.list_exams()
    return jsonify(body), status


@predict_bp.route('/predict', methods=['GET'])
@jwt_required()
def predict():
    match_profile = request.args.get('match_profile', 'true').lower() != 'false'
    body, status = PredictService.predict(
        value=request.args.get('rank', type=int),
        exam=request.args.get('exam', ''),
        user_id=get_jwt_identity(),
        match_profile=match_profile,
        input_mode=request.args.get('input_mode', '') or None,
    )
    return jsonify(body), status
