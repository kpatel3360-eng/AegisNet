from flask import Blueprint, jsonify
from backend.services.analytics_service import AnalyticsService
from backend.services.traffic_service import TrafficService
from backend.services.model_service import ModelService

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    try:
        analytics_service = AnalyticsService()
        traffic_service = TrafficService()
        model_service = ModelService()

        # Get default demo analysis from test dataset sample
        cyber_analysis = analytics_service.get_demo_analysis()
        traffic_forecast = traffic_service.get_traffic_forecast()

        payload = {
            "application": "AegisNet",
            "status": "active",
            "models_loaded": model_service.is_loaded,
            "cybersecurity": cyber_analysis,
            "traffic": {
                "current_traffic_mb": traffic_forecast["current_traffic_mb"],
                "predicted_traffic_mb": traffic_forecast["predicted_traffic_mb"],
                "percentage_change": traffic_forecast["percentage_change"],
                "display_change": traffic_forecast.get("display_change", "N/A"),
                "trend": traffic_forecast["trend"],
                "current_timestamp": traffic_forecast["current_timestamp"],
                "next_timestamp": traffic_forecast["next_timestamp"],
                "history": traffic_forecast["history"][:20]
            },
            "models": {
                "binary": "Gradient Boosting (99.89% Acc)",
                "multiclass": "Random Forest (98.82% Acc)",
                "forecaster": "Random Forest Regressor (R² = 0.2124)"
            }
        }
        return jsonify(payload), 200

    except Exception as e:
        return jsonify({"error": f"Failed to assemble dashboard summary: {str(e)}"}), 500
