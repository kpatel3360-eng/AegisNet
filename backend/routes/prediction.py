import io
import pandas as pd
from flask import Blueprint, request, jsonify
from backend.config import Config
from backend.services.model_service import ModelService
from backend.services.analytics_service import AnalyticsService
from backend.utils.validation import validate_csv_file

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/api/analyze', methods=['POST'])
def analyze_traffic_csv():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    is_valid, err_msg = validate_csv_file(file, max_bytes=Config.MAX_CONTENT_LENGTH)
    if not is_valid:
        return jsonify({"error": err_msg}), 400

    try:
        # Read CSV file
        df = pd.read_csv(io.BytesIO(file.read()), encoding='cp1252', low_memory=False)
        
        analytics_service = AnalyticsService()
        results = analytics_service.analyze_dataframe(df, is_demo=False)
        
        return jsonify(results), 200

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 422
    except Exception as e:
        return jsonify({"error": f"Failed to parse or analyze CSV file: {str(e)}"}), 500


@prediction_bp.route('/api/models', methods=['GET'])
def get_model_info():
    model_service = ModelService()
    return jsonify({
        "status": "ok",
        "binary_model": {
            "name": "Gradient Boosting Classifier (LightGBM GBDT)",
            "accuracy": 0.9989,
            "attack_recall": 0.9996,
            "attack_f1": 0.9967
        },
        "multiclass_model": {
            "name": "Random Forest Classifier (LightGBM RF)",
            "accuracy": 0.9882,
            "macro_recall": 0.9154,
            "macro_f1": 0.6566,
            "classes_count": 15
        },
        "forecasting_model": {
            "name": "Random Forest Regressor (LightGBM RF)",
            "r2_score": 0.2124,
            "aggregation_interval": "1 minute"
        },
        "feature_count": len(model_service.feature_names),
        "feature_names": model_service.feature_names,
        "classification_metadata": model_service.classification_metadata,
        "traffic_metadata": model_service.traffic_metadata
    }), 200
