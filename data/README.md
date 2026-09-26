# Data Directory

This directory manages the raw and processed datasets for the **AI-Powered Network Traffic Prediction and Cyber Attack Monitoring Dashboard**.

## Directory Structure

```
data/
├── raw/
│   ├── cybersecurity/
│   └── traffic/
├── processed/
│   ├── cybersecurity/
│   └── traffic/
└── README.md
```

## Directory Descriptions and Guidelines

### 1. `raw/`
- **Purpose:** Stores original, un-modified raw datasets used as source data for the project.
- **Immutability Rule:** Raw files **must remain completely unchanged** and untouched. Preprocessing scripts must never alter, overwrite, or edit files in this directory.

#### Locations:
- **Cybersecurity Dataset Location:** `data/raw/cybersecurity/`
  - Intended for original cybersecurity and network intrusion detection datasets (e.g., CIC-IDS2017).
- **Traffic Prediction Dataset Location:** `data/raw/traffic/`
  - Intended for original network traffic time-series datasets used for volume and bandwidth prediction.

---

### 2. `processed/`
- **Purpose:** Stores cleaned, normalized, and feature-engineered datasets created by our data preprocessing pipeline.
- **Pipeline Output:** All datasets in this directory are programmatically generated downstream from the raw data.

#### Locations:
- **Processed Cybersecurity Data Location:** `data/processed/cybersecurity/`
  - Stores cleaned and feature-engineered datasets prepared for intrusion detection model training and analysis.
- **Processed Traffic Data Location:** `data/processed/traffic/`
  - Stores processed time-series traffic data prepared for traffic forecasting models.
