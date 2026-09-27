# AegisNet Class Weighting Controlled Experiment Report

## Executive Summary
This report presents the empirical findings of a controlled experiment evaluating the impact of setting `class_weight="balanced"` on the AegisNet Level-2 Multiclass LightGBM Classifier. The experiment was conducted in complete isolation from the production system without modifying any production models, code, metadata, or API behaviors.

---

## 1. Experimental Setup & Safety Isolation
- **Base Architecture**: `LGBMClassifier` (`n_estimators=100`, `max_depth=15`, `random_state=42`, `n_jobs=-1`)
- **Control (Production Model)**: `class_weight=None` (Unweighted default loss)
- **Treatment (Experimental Model)**: `class_weight="balanced"`
- **Features Used**: Exact 46 numerical features from `feature_names.json` (unscaled)
- **Model Storage**: Saved exclusively as `models/experiments/webattack_balanced_level2.joblib`

---

## 2. Evaluation on `test.parquet` Holdout Set
Evaluated across all 15 classes in `data/processed/cybersecurity/test.parquet` (504,473 rows):

- **Overall Accuracy**: 99.87%
- **Macro Precision**: 92.25%
- **Macro Recall**: 89.11%
- **Macro F1-Score**: 89.75%
- **Weighted Precision**: 99.88%
- **Weighted Recall**: 99.87%
- **Weighted F1-Score**: 99.87%

---

## 3. Direct Side-by-Side Comparison on Thursday WebAttacks Dataset
Evaluated on `Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv` (170,366 rows):

| Metric | Production (`class_weight=None`) | Experimental (`class_weight="balanced"`) | Absolute Change |
| :--- | :--- | :--- | :--- |
| **Binary Accuracy** | 99.97% | 99.97% | 0.00% |
| **Binary Attack Recall** | 99.59% | 99.59% | 0.00% |
| **Multiclass Accuracy** | 99.45% | **99.77%** | +0.32% |
| **Macro Precision** | 24.40% | **35.93%** | +11.53% |
| **Macro Recall** | 32.54% | **35.73%** | +3.20% |
| **Macro F1-Score** | 24.28% | **35.60%** | +11.32% |
| **Weighted F1-Score** | 99.48% | **99.78%** | +0.30% |
| **Brute Force Precision** | 85.78% | **93.85%** | +8.07% |
| **Brute Force Recall** | 50.83% | **80.03%** | +29.20% |
| **Brute Force F1-Score** | 63.83% | **86.39%** | +22.56% |
| **XSS Precision** | 45.63% | **65.43%** | +19.80% |
| **XSS Recall** | 74.54% | **86.81%** | +12.27% |
| **XSS F1-Score** | 56.61% | **74.62%** | +18.01% |
| **SQL Injection Precision** | 12.57% | **100.00%** | +87.43% |
| **SQL Injection Recall** | 100.00% | **90.48%** | -9.52% |
| **SQL Injection F1-Score** | 22.34% | **95.00%** | +72.66% |

---

## 4. Main Confusion Pairs Analysis

| Confusion Pair (Actual → Predicted) | Production (`class_weight=None`) | Experimental (`class_weight="balanced"`) | Net Flow Difference |
| :--- | :--- | :--- | :--- |
| **Web Attack - Brute Force → Web Attack - XSS** | 578 | 299 | -279 |
| **Web Attack - Brute Force → Web Attack - Sql Injection** | 143 | 0 | -143 |
| **Web Attack - XSS → Web Attack - Brute Force** | 127 | 78 | -49 |
| **Web Attack - XSS → BENIGN** | 33 | 7 | -26 |
| **Web Attack - Brute Force → BENIGN** | 19 | 2 | -17 |

---

## 5. Sanity Checks & Non-Deployment Compliance
- [x] Production `.joblib` files untouched: **PASSED**
- [x] Production model metadata untouched: **PASSED**
- [x] Production preprocessing codebase untouched: **PASSED**
- [x] Frontend codebase untouched: **PASSED**
- [x] `feature_names.json` untouched: **PASSED**
- [x] `label_encoder.joblib` untouched: **PASSED**
- [x] Input feature count == 46: **PASSED**
- [x] Prediction row count (170,366) matches CSV row count: **PASSED**
- [x] Zero NaN/Inf in model input: **PASSED**
- [x] Production deployment prevented: **PASSED**

---

## 6. Factual Summary of Trade-Offs
- Setting `class_weight="balanced"` significantly increases sensitivity for rare classes across the model.
- Metrics that improved or decreased are documented factually in the side-by-side comparison table above.
- The experimental model remains safely stored in `models/experiments/webattack_balanced_level2.joblib` for further offline review.
