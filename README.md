# AegisNet — AI-Powered Network Intelligence & Cyber Security Monitoring Platform

**AegisNet** is an enterprise-grade artificial intelligence network intelligence and cybersecurity platform powered by machine learning models trained on over 2.5 million network flows from the benchmark **CIC-IDS2017** dataset.

---

## 🌟 Key Features

1. **Level 1 Binary Attack Detection**: High-speed GBDT classifier detecting `BENIGN` vs. `ATTACK` flows (**99.89% Accuracy, 99.96% ATTACK Recall**).
2. **Level 2 Multiclass Threat Classification**: Balanced Random Forest classifier identifying 15 specific attack vectors (DDoS, DoS Hulk, PortScan, FTP-Patator, SSH-Patator, Bot, etc.) with **91.54% Macro Recall**.
3. **Network Traffic Volume Forecasting**: Time-series regression predicting next 1-minute network traffic volume (**R² = 0.2124**).
4. **Interactive Command Center Dashboard**: Modern dark-themed cybersecurity interface built with React, Vite, Tailwind CSS, and Recharts.
5. **Real-time CSV Analysis**: Drag-and-drop CSV traffic analyzer evaluating uploaded packet flows using real pre-trained ML models.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10+, Flask, Flask-CORS, scikit-learn, LightGBM, pandas, NumPy, joblib
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Recharts, Lucide Icons
- **ML & Data Pipeline**: Jupyter Notebooks (`notebooks/01_Data_Inspection.ipynb` to `04_Traffic_Prediction.ipynb`), PyArrow, Parquet

---

## 🚀 How to Run AegisNet

### 1. Start Flask Backend API Server
```bash
# Activate virtual environment
.venv/Scripts/activate   # Windows
# or source .venv/bin/activate (Linux/Mac)

# Start Backend Server (Port 5000)
python backend/app.py
```

### 2. Start React Frontend Server
```bash
cd frontend

# Start Frontend Dev & Proxy Server (Port 3000)
node server.js
```
Open **http://127.0.0.1:3000** in your web browser.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & loaded models status |
| `GET` | `/api/dashboard/summary` | Combined KPI metrics, threat risk & traffic forecast |
| `POST` | `/api/analyze` | Upload CSV for binary & multiclass flow classification |
| `POST` | `/api/traffic/predict` | Next 1-minute network traffic volume forecast |
| `GET` | `/api/models` | Deployed ML model metadata & feature inventory |

---

## 📂 Model Artifacts & Files

All trained models and preprocessing artifacts are stored in `models/`:
- `models/binary_gradient_boosting.joblib`
- `models/multiclass_random_forest.joblib`
- `models/network_traffic_forecaster.joblib`
- `models/preprocessing/scaler.joblib`
- `models/preprocessing/label_encoder.joblib`
- `models/preprocessing/binary_label_encoder.joblib`
- `models/preprocessing/feature_names.json`
- `models/model_metadata.json`
- `models/traffic_prediction_metadata.json`

---

## ⚠️ Dataset Limitations

1. **Working Hours Capture Gaps**: CIC-IDS2017 raw data was collected exclusively between 08:00 and 17:00, leading to step-discontinuities across days.
2. **Synthetic Attack Execution**: Traffic bursts correlate with pre-scheduled attack windows rather than organic human usage patterns.
3. **Derived Timestamps**: Explicit timestamp strings were omitted from the MachineLearningCSV dataset version for anonymity, requiring linear session reconstruction.
