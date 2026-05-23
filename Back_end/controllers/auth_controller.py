"""View layer — HTTP routes for authentication."""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    body, status = AuthService.register(request.get_json())
    return jsonify(body), status


@auth_bp.route('/login', methods=['POST'])
def login():
    body, status = AuthService.login(request.get_json())
    return jsonify(body), status


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    body, status = AuthService.get_profile(get_jwt_identity())
    return jsonify(body), status


@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    body, status = AuthService.update_profile(get_jwt_identity(), request.get_json())
    return jsonify(body), status


@auth_bp.route('/fields', methods=['GET'])
def registration_options():
    body, status = AuthService.registration_options()
    return jsonify(body), status
