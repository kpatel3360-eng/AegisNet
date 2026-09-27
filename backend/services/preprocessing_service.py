import numpy as np
import pandas as pd
from backend.services.model_service import ModelService

class PreprocessingService:
    def __init__(self):
        self.model_service = ModelService()

    def preprocess_df(self, df: pd.DataFrame):
        # 1. Strip column names
        df_clean = df.copy()
        df_clean.columns = df_clean.columns.str.strip()

        # 2. Check for missing columns
        required_cols = self.model_service.feature_names
        missing_cols = [col for col in required_cols if col not in df_clean.columns]
        if missing_cols:
            raise ValueError(f"Missing required features: {missing_cols}")

        # Select exact 46 features in correct order
        X = df_clean[required_cols].copy()

        # 3. Convert negative sentinel values (< 0) to NaN before median imputation
        sentinel_cols = ['Init_Win_bytes_forward', 'Init_Win_bytes_backward', 'min_seg_size_forward', 'Fwd Header Length', 'Flow Duration']
        for col in sentinel_cols:
            if col in X.columns:
                X[col] = X[col].apply(lambda val: np.nan if pd.notnull(val) and val < 0 else val)

        # 4. Replace Inf / -Inf with NaN and fill with column median / 0
        X = X.replace([np.inf, -np.inf], np.nan)
        X = X.fillna(X.median(numeric_only=True)).fillna(0)

        # 5. Return unscaled feature matrix X.values for tree-based classification models
        # (Classification models were trained directly on unscaled raw feature values)
        X_unscaled = X.values

        return X, X_unscaled

