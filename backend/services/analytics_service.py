import os
import pandas as pd
import numpy as np
from backend.config import Config
from backend.services.model_service import ModelService
from backend.services.preprocessing_service import PreprocessingService

class AnalyticsService:
    def __init__(self):
        self.model_service = ModelService()
        self.preprocessing_service = PreprocessingService()

    def analyze_dataframe(self, df: pd.DataFrame, is_demo=False):
        # Preprocess features
        X_raw, X_unscaled = self.preprocessing_service.preprocess_df(df)

        # 1. Level 1 Binary Predictions
        binary_preds = self.model_service.binary_model.predict(X_unscaled)
        if hasattr(self.model_service.binary_model, "predict_proba"):
            binary_probs = self.model_service.binary_model.predict_proba(X_unscaled)
            binary_conf = np.max(binary_probs, axis=1)
        else:
            binary_conf = np.ones(len(binary_preds))

        # Decode binary labels
        binary_label_names = self.model_service.binary_label_encoder.inverse_transform(binary_preds)

        # 2. Level 2 Multiclass Predictions for detected attacks
        multiclass_preds = np.zeros(len(df), dtype=int) # Default BENIGN index (0)
        multiclass_conf = binary_conf.copy()

        attack_mask = (binary_label_names != 'BENIGN')
        if np.any(attack_mask):
            X_attack_unscaled = X_unscaled[attack_mask]
            mc_preds = self.model_service.multiclass_model.predict(X_attack_unscaled)
            multiclass_preds[attack_mask] = mc_preds

            if hasattr(self.model_service.multiclass_model, "predict_proba"):
                mc_probs = self.model_service.multiclass_model.predict_proba(X_attack_unscaled)
                multiclass_conf[attack_mask] = np.max(mc_probs, axis=1)

        # Decode multiclass labels
        multiclass_label_names = self.model_service.label_encoder.inverse_transform(multiclass_preds)
        # Ensure rows predicted as BENIGN stay BENIGN in final label
        multiclass_label_names[~attack_mask] = 'BENIGN'

        # 3. Calculate Summary Statistics
        total_flows = int(len(df))
        attack_count = int(np.sum(attack_mask))
        benign_count = total_flows - attack_count
        attack_pct = float((attack_count / total_flows) * 100) if total_flows > 0 else 0.0

        # Attack Distribution breakdown
        unique_labels, counts = np.unique(multiclass_label_names, return_counts=True)
        attack_dist = []
        most_common_attack = "BENIGN"
        max_attack_cnt = 0

        for lbl, cnt in zip(unique_labels, counts):
            cnt_val = int(cnt)
            pct_val = float((cnt_val / total_flows) * 100)
            attack_dist.append({
                "label": str(lbl),
                "count": cnt_val,
                "percentage": round(pct_val, 2)
            })
            if lbl != 'BENIGN' and cnt_val > max_attack_cnt:
                most_common_attack = str(lbl)
                max_attack_cnt = cnt_val

        # Sort attack distribution descending by count
        attack_dist.sort(key=lambda x: x['count'], reverse=True)

        # Risk Classification Assessment
        if attack_pct == 0:
            risk_level = "Low"
            risk_color = "emerald"
        elif attack_pct < 5.0:
            risk_level = "Medium"
            risk_color = "amber"
        elif attack_pct < 25.0:
            risk_level = "High"
            risk_color = "rose"
        else:
            risk_level = "Critical"
            risk_color = "red"

        # Generate sample recent detections (first 25 rows or attack rows)
        recent_detections = []
        sample_indices = np.where(attack_mask)[0] if np.any(attack_mask) else np.arange(min(20, total_flows))
        sample_indices = sample_indices[:20]

        for i in sample_indices:
            lbl = str(multiclass_label_names[i])
            is_att = (lbl != 'BENIGN')
            conf = float(multiclass_conf[i])
            
            recent_detections.append({
                "id": int(i + 1),
                "flow_index": int(i),
                "binary_prediction": "ATTACK" if is_att else "BENIGN",
                "attack_type": lbl,
                "confidence": round(conf * 100, 1),
                "risk": "High" if is_att and conf > 0.8 else ("Medium" if is_att else "Low")
            })

        return {
            "is_demo": is_demo,
            "summary": {
                "total_flows": total_flows,
                "benign_flows": benign_count,
                "attack_flows": attack_count,
                "attack_percentage": round(attack_pct, 2),
                "most_common_attack": most_common_attack,
                "risk_level": risk_level,
                "risk_color": risk_color
            },
            "attack_distribution": attack_dist,
            "recent_detections": recent_detections
        }

    def get_demo_analysis(self):
        # Load sample from test.parquet if present
        if os.path.exists(Config.TEST_PARQUET_PATH):
            df_sample = pd.read_parquet(Config.TEST_PARQUET_PATH).head(1000)
            return self.analyze_dataframe(df_sample, is_demo=True)
        else:
            # Fallback synthetic frame with correct features
            feat_names = self.model_service.feature_names
            data = np.random.randn(200, len(feat_names))
            df_synth = pd.DataFrame(data, columns=feat_names)
            return self.analyze_dataframe(df_synth, is_demo=True)
