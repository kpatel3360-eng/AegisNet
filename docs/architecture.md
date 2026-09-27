# AegisNet System Architecture & Design Documentation

## 1. Executive Overview

**AegisNet** is an AI-powered network intelligence and cybersecurity monitoring platform engineered for enterprise network protection and bandwidth forecasting. The platform combines a two-level machine learning cyber attack classification pipeline with time-series network traffic volume forecasting models.

---

## 2. High-Level Architecture Diagram

```
                              +---------------------------------------+
                              |         AEGISNET FRONTEND (React)      |
                              |  Vite + Tailwind CSS + Recharts UI    |
                              +------------------+--------------------+
                                                 | REST APIs (HTTP / JSON)
                                                 v
                              +------------------+--------------------+
                              |         FLASK BACKEND API GATEWAY     |
                              |  Flask + Flask-CORS + Route Blueprints|
                              +------------------+--------------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
        +--------------+--------------+                     +--------------+--------------+
        |   PREPROCESSING SERVICE     |                     |    TRAFFIC FORECAST SERVICE  |
        | Scaler & Feature Alignment  |                     |  Time-Series Lag & Rolling  |
        +--------------+--------------+                     +--------------+--------------+
                       |                                                   |
                       v                                                   v
        +--------------+--------------+                     +--------------+--------------+
        |  CLASSIFICATION ENGINE      |                     |    FORECASTING ENGINE       |
        | - Level 1: Binary GBDT      |                     | - Random Forest Regressor   |
        | - Level 2: Multiclass RF    |                     |   (Next 1-min Byte Volume)  |
        +--------------+--------------+                     +--------------+--------------+
                       |                                                   |
                       +-------------------------+-------------------------+
                                                 |
                                                 v
                              +------------------+--------------------+
                              |       MODELS & ARTIFACT REPOSITORY    |
                              |  - binary_gradient_boosting.joblib    |
                              |  - multiclass_random_forest.joblib    |
                              |  - network_traffic_forecaster.joblib  |
                              |  - scaler.joblib & label_encoders     |
                              +---------------------------------------+
```

---

## 3. Data Pipeline & Processing Pipeline

### Phase 1: Data Inspection
- **Source**: Benchmark CIC-IDS2017 dataset (8 raw CSV files, 2.83M rows, 79 features).
- **Audit Findings**: Identified 308,381 duplicate rows, +Inf values in rate columns, and collinear packet length features.

### Phase 2: Data Preprocessing & Feature Engineering
- **Cleaning**: Replaced infinite values (+Inf, -Inf) with median and handled zero-variance columns.
- **Selection**: Retained 46 optimal numerical features.
- **Scaling**: Standardized using `AegisRobustScaler` (quantile range 25%-75%).
- **Outputs**: `data/processed/cybersecurity/train.parquet` (2.01M rows), `test.parquet` (504k rows).

### Phase 3: Cyber Attack Classification
- **Level 1 (Binary Classification)**: Classifies traffic into `BENIGN` vs `ATTACK`.
  - Best Model: **Gradient Boosting Classifier (LightGBM GBDT)**
  - Accuracy: **99.89%** | ATTACK Recall: **99.96%** | ATTACK F1: **0.9967**
- **Level 2 (Multiclass Classification)**: Classifies detected attacks into 15 specific categories (DoS, DDoS, PortScan, Patator, Bot, etc.).
  - Best Model: **Random Forest Classifier (LightGBM RF)** with `class_weight='balanced'`
  - Accuracy: **98.82%** | Macro Recall: **91.54%** | Weighted F1: **0.9924**

### Phase 4: Network Traffic Volume Prediction
- **Time-Series Construction**: Binned flow data into 1-minute aggregated intervals.
- **Feature Engineering**: Generated temporal features (`hour`, `minute`, `day_of_week`), lag features (`lag_1` .. `lag_10`), and rolling statistics (`rolling_mean_5`, `rolling_std_10`).
- **Target**: Next 1-minute network traffic volume (`Total_Bytes`).
- **Best Model**: **Random Forest Regressor** (R² = **0.2124**, RMSE = **56.72 MB/min**).

---

## 4. Backend Architecture (Flask REST API)

- **Single-Load Model Architecture**: All joblib models and preprocessing artifacts are loaded ONCE into memory during Flask server startup inside `services/model_service.py`.
- **API Blueprints**:
  - `GET /api/health` -> System health and model load verification.
  - `POST /api/analyze` -> Receives user-uploaded CSV network flows, runs preprocessing, Level 1 binary classification, Level 2 multiclass classification, and returns JSON summary stats.
  - `POST /api/traffic/predict` -> Generates next 1-minute network traffic volume predictions.
  - `GET /api/dashboard/summary` -> Assembles unified monitoring KPI stats and recent detections.
  - `GET /api/models` -> Returns trained model performance metadata and retained feature lists.

---

## 5. Frontend Architecture (React + Vite + Tailwind CSS)

- **Design Aesthetics**: Modern dark cybersecurity interface (`#090d16` background, glowing cyan `#06b6d4`, emerald `#10b981`, and rose `#f43f5e` badges).
- **Navigation & Routing**: React Router v6 mapping to 5 core views:
  - `/` -> Main Command Center Dashboard
  - `/threats` -> Threat Detection Analysis
  - `/traffic` -> Network Traffic Volume Forecasting
  - `/analytics` -> System Metrics & Retained Features
  - `/about` -> Platform Architecture & Pipeline Flowchart
- **Visualizations**: Interactive charts powered by `Recharts` (Pie charts, Bar breakdown charts, Time-series Line plots).
