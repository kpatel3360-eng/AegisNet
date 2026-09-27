import os
import sys

# Add project root to sys.path so backend imports resolve cleanly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.services.model_service import ModelService
from backend.routes.health import health_bp
from backend.routes.prediction import prediction_bp
from backend.routes.traffic import traffic_bp
from backend.routes.dashboard import dashboard_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (supporting Vite frontend)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Load ML models ONCE at app creation
    with app.app_context():
        print("Initializing AegisNet Flask application...")
        ModelService()

    # Register Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(prediction_bp)
    app.register_blueprint(traffic_bp)
    app.register_blueprint(dashboard_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting AegisNet Backend API Server on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
