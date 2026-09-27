import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from backend.config import Config

# Define helper classes for joblib unpickling compatibility
class AegisLabelEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.classes_ = None
        self.mapping_ = {}
        self.inverse_mapping_ = {}

    def fit(self, y):
        self.classes_ = np.unique(y)
        self.mapping_ = {val: idx for idx, val in enumerate(self.classes_)}
        self.inverse_mapping_ = {idx: val for idx, val in enumerate(self.classes_)}
        return self

    def transform(self, y):
        mapping = getattr(self, 'mapping_', {})
        return np.array([mapping.get(val, -1) for val in y])

    def fit_transform(self, y):
        return self.fit(y).transform(y)

    def inverse_transform(self, y):
        classes = getattr(self, 'classes_', None)
        if classes is not None:
            return np.array([classes[idx] if 0 <= idx < len(classes) else 'UNKNOWN' for idx in y])
        inv_map = getattr(self, 'inverse_mapping_', {})
        return np.array([inv_map.get(idx, 'UNKNOWN') for idx in y])

class AegisRobustScaler(BaseEstimator, TransformerMixin):
    def __init__(self, with_centering=True, with_scaling=True, quantile_range=(25.0, 75.0)):
        self.with_centering = with_centering
        self.with_scaling = with_scaling
        self.quantile_range = quantile_range
        self.center_ = None
        self.scale_ = None

    def fit(self, X):
        X_arr = np.asarray(X, dtype=np.float64)
        q_min, q_max = self.quantile_range
        q_lower = np.nanpercentile(X_arr, q_min, axis=0)
        q_upper = np.nanpercentile(X_arr, q_max, axis=0)
        
        self.center_ = np.nanmedian(X_arr, axis=0)
        iqr = q_upper - q_lower
        iqr[iqr == 0] = 1.0
        self.scale_ = iqr
        return self

    def transform(self, X):
        X_arr = np.asarray(X, dtype=np.float64)
        if getattr(self, 'with_centering', True) and getattr(self, 'center_', None) is not None:
            X_arr = X_arr - self.center_
        if getattr(self, 'with_scaling', True) and getattr(self, 'scale_', None) is not None:
            X_arr = X_arr / self.scale_
        return X_arr

    def fit_transform(self, X):
        return self.fit(X).transform(X)

# Inject classes into __main__ for joblib unpickling compatibility
setattr(sys.modules['__main__'], 'AegisLabelEncoder', AegisLabelEncoder)
setattr(sys.modules['__main__'], 'AegisRobustScaler', AegisRobustScaler)


class ModelService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance.is_loaded = False
            cls._instance.load_models()
        return cls._instance

    def load_models(self):
        try:
            print("Loading AegisNet ML models and preprocessing artifacts ONCE...")

            # 1. Load Preprocessing Artifacts
            with open(Config.FEATURE_NAMES_PATH, 'r') as f:
                fn_data = json.load(f)
                if isinstance(fn_data, dict) and "numerical_features" in fn_data:
                    self.feature_names = fn_data["numerical_features"]
                elif isinstance(fn_data, list):
                    self.feature_names = fn_data
                else:
                    self.feature_names = []

            with open(Config.PREPROCESSING_CONFIG_PATH, 'r') as f:
                self.preprocessing_config = json.load(f)

            self.scaler = joblib.load(Config.SCALER_PATH)
            self.label_encoder = joblib.load(Config.LABEL_ENCODER_PATH)
            self.binary_label_encoder = joblib.load(Config.BINARY_LABEL_ENCODER_PATH)

            # 2. Load Classification Models
            self.binary_model = joblib.load(Config.BINARY_MODEL_PATH)
            self.multiclass_model = joblib.load(Config.MULTICLASS_MODEL_PATH)

            # 3. Load Traffic Forecaster Model
            self.forecaster_model = joblib.load(Config.FORECASTER_MODEL_PATH)

            # 4. Load Metadata Files
            if os.path.exists(Config.MODEL_METADATA_PATH):
                with open(Config.MODEL_METADATA_PATH, 'r') as f:
                    self.classification_metadata = json.load(f)
            else:
                self.classification_metadata = {}

            if os.path.exists(Config.TRAFFIC_METADATA_PATH):
                with open(Config.TRAFFIC_METADATA_PATH, 'r') as f:
                    self.traffic_metadata = json.load(f)
            else:
                self.traffic_metadata = {}

            self.is_loaded = True
            print(f"All AegisNet models and artifacts loaded successfully ({len(self.feature_names)} features)!")
        except Exception as e:
            print(f"Error loading AegisNet models: {str(e)}")
            self.is_loaded = False
            raise e

    def get_models_status(self):
        return {
            "status": "ok" if self.is_loaded else "error",
            "application": "AegisNet",
            "models_loaded": self.is_loaded,
            "feature_count": len(self.feature_names) if self.is_loaded else 0,
            "binary_model": "Gradient Boosting (LGBM GBDT)",
            "multiclass_model": "Random Forest (LGBM RF)",
            "traffic_forecaster": "Random Forest Regressor"
        }
