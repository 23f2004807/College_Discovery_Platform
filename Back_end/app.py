"""
Application entry — wires extensions and MVP route blueprints.
Architecture:
  Model       → models/ + repositories/
  Presenter   → services/
  View        → controllers/
"""
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db
from routes import register_routes
from database.bootstrap import initialize_database


def create_app(bootstrap=True):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    CORS(app, resources={r'/api/*': {'origins': '*'}})

    register_routes(app)

    if bootstrap:
        with app.app_context():
            initialize_database()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
