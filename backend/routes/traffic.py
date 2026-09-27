from flask import Blueprint, jsonify, request
from backend.services.traffic_service import TrafficService

traffic_bp = Blueprint('traffic', __name__)

@traffic_bp.route('/api/traffic/predict', methods=['GET', 'POST'])
def predict_traffic():
    try:
        traffic_service = TrafficService()
        forecast = traffic_service.get_traffic_forecast()
        return jsonify(forecast), 200
    except FileNotFoundError as fnf:
        return jsonify({"error": str(fnf)}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to generate traffic forecast: {str(e)}"}), 500
