import os

class Config:
    # Base directories
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    MODELS_DIR = os.path.join(BASE_DIR, 'models')
    PREPROCESSING_DIR = os.path.join(MODELS_DIR, 'preprocessing')
    PROCESSED_DATA_DIR = os.path.join(BASE_DIR, 'data', 'processed')
    TRAFFIC_DATA_DIR = os.path.join(PROCESSED_DATA_DIR, 'traffic')
    CYBER_DATA_DIR = os.path.join(PROCESSED_DATA_DIR, 'cybersecurity')

    # File paths - Models
    BINARY_MODEL_PATH = os.path.join(MODELS_DIR, 'binary_gradient_boosting.joblib')
    MULTICLASS_MODEL_PATH = os.path.join(MODELS_DIR, 'multiclass_random_forest_balanced.joblib')
    FORECASTER_MODEL_PATH = os.path.join(MODELS_DIR, 'network_traffic_forecaster.joblib')

    # File paths - Preprocessing
    LABEL_ENCODER_PATH = os.path.join(PREPROCESSING_DIR, 'label_encoder.joblib')
    BINARY_LABEL_ENCODER_PATH = os.path.join(PREPROCESSING_DIR, 'binary_label_encoder.joblib')
    SCALER_PATH = os.path.join(PREPROCESSING_DIR, 'scaler.joblib')
    FEATURE_NAMES_PATH = os.path.join(PREPROCESSING_DIR, 'feature_names.json')
    PREPROCESSING_CONFIG_PATH = os.path.join(PREPROCESSING_DIR, 'preprocessing_config.json')

    # Metadata
    MODEL_METADATA_PATH = os.path.join(MODELS_DIR, 'model_metadata.json')
    TRAFFIC_METADATA_PATH = os.path.join(MODELS_DIR, 'traffic_prediction_metadata.json')

    # Processed Datasets
    TEST_PARQUET_PATH = os.path.join(CYBER_DATA_DIR, 'test.parquet')
    TRAFFIC_TIMESERIES_PATH = os.path.join(TRAFFIC_DATA_DIR, 'network_traffic_timeseries.parquet')

    # Upload Limits
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB max limit
    ALLOWED_EXTENSIONS = {'csv'}
