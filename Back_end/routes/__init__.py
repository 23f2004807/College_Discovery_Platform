"""Register all view blueprints."""
from controllers.auth_controller import auth_bp
from controllers.college_controller import college_bp
from controllers.review_controller import review_bp
from controllers.predict_controller import predict_bp
from controllers.saved_controller import saved_bp
from controllers.stats_controller import stats_bp


def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(college_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(saved_bp)
    app.register_blueprint(stats_bp)
