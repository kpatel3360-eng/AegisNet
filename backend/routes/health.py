from flask import Blueprint, jsonify
from backend.services.model_service import ModelService

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    model_service = ModelService()
    status = model_service.get_models_status()
    return jsonify(status), 200
