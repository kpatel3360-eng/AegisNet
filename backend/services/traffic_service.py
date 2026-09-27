import os
import pandas as pd
import numpy as np
from backend.config import Config
from backend.services.model_service import ModelService

class TrafficService:
    def __init__(self):
        self.model_service = ModelService()
        self.timeseries_path = Config.TRAFFIC_TIMESERIES_PATH

    def get_traffic_forecast(self):
        if not os.path.exists(self.timeseries_path):
            raise FileNotFoundError("Processed time-series dataset not found.")

        ts_df = pd.read_parquet(self.timeseries_path)
        ts_df['Timestamp'] = pd.to_datetime(ts_df['Timestamp'])
        ts_df = ts_df.sort_values('Timestamp').reset_index(drop=True)

        # Feature engineering on time series
        df_fe = ts_df.copy()
        df_fe['hour'] = df_fe['Timestamp'].dt.hour
        df_fe['minute'] = df_fe['Timestamp'].dt.minute
        df_fe['day_of_week'] = df_fe['Timestamp'].dt.dayofweek

        for lag in [1, 2, 3, 5, 10]:
            df_fe[f'lag_{lag}'] = df_fe['Total_Bytes'].shift(lag)

        df_fe['rolling_mean_5'] = df_fe['Total_Bytes'].rolling(5).mean()
        df_fe['rolling_mean_10'] = df_fe['Total_Bytes'].rolling(10).mean()
        df_fe['rolling_std_10'] = df_fe['Total_Bytes'].rolling(10).std()

        df_clean = df_fe.dropna().reset_index(drop=True)

        feature_cols = [
            'hour', 'minute', 'day_of_week',
            'lag_1', 'lag_2', 'lag_3', 'lag_5', 'lag_10',
            'rolling_mean_5', 'rolling_mean_10', 'rolling_std_10',
            'Total_Packets', 'Flow_Count', 'Avg_Flow_Bytes', 'Avg_Flow_Packets', 'Attack_Percentage'
        ]

        # Use latest observation to predict next interval volume
        latest_row = df_clean.iloc[[-1]]
        X_latest = latest_row[feature_cols]
        predicted_bytes = float(self.model_service.forecaster_model.predict(X_latest)[0])
        predicted_bytes = max(0.0, predicted_bytes)

        current_row = df_clean.iloc[-1]
        current_bytes = float(current_row['Total_Bytes'])
        current_timestamp = str(current_row['Timestamp'])
        
        # Calculate predicted timestamp (+1 minute)
        next_dt = current_row['Timestamp'] + pd.Timedelta(minutes=1)
        next_timestamp = str(next_dt)

        # Historical chart data (last 50 intervals)
        recent_history = df_clean.tail(50).copy()
        history_list = []
        for idx, row in recent_history.iterrows():
            history_list.append({
                "timestamp": str(row['Timestamp']),
                "total_bytes": float(row['Total_Bytes']),
                "total_mb": float(row['Total_Bytes']) / 1e6,
                "total_packets": int(row['Total_Packets']),
                "flow_count": int(row['Flow_Count']),
                "attack_percentage": float(row['Attack_Percentage'])
            })

        # Calculate traffic trend percentage change safely
        # Handle zero or negative current volume cleanly
        if current_bytes <= 0:
            pct_change = None
            display_change = "N/A"
            trend = "increasing" if predicted_bytes > 0 else "stable"
        else:
            raw_pct = ((predicted_bytes - current_bytes) / current_bytes) * 100.0
            if np.isnan(raw_pct) or np.isinf(raw_pct) or abs(raw_pct) > 10000:
                pct_change = None
                display_change = "N/A"
                trend = "increasing" if predicted_bytes > current_bytes else "decreasing"
            else:
                pct_change = round(float(raw_pct), 2)
                display_change = f"{'+' if pct_change > 0 else ''}{pct_change:.2f}%"
                trend = "increasing" if pct_change > 2.0 else ("decreasing" if pct_change < -2.0 else "stable")

        return {
            "current_timestamp": current_timestamp,
            "next_timestamp": next_timestamp,
            "current_traffic_bytes": current_bytes,
            "current_traffic_mb": round(current_bytes / 1e6, 2),
            "predicted_traffic_bytes": predicted_bytes,
            "predicted_traffic_mb": round(predicted_bytes / 1e6, 2),
            "percentage_change": pct_change,
            "display_change": display_change,
            "trend": trend,
            "history": history_list,
            "metadata": self.model_service.traffic_metadata
        }

