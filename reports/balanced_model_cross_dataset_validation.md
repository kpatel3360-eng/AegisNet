# AegisNet Balanced Model Cross-Dataset Regression Test Report

## Executive Summary
This report presents a cross-dataset regression evaluation comparing the **Current Production Level-2 Multiclass Model** (`class_weight=None`) against the **Experimental Balanced Model** (`models/experiments/webattack_balanced_level2.joblib`, `class_weight="balanced"`). 

The evaluation was conducted across three major cybersecurity benchmark datasets:
1. **DDoS Dataset**: `Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv` (225,745 flows)
2. **PortScan Dataset**: `Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv` (286,467 flows)
3. **WebAttacks Dataset**: `Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv` (170,366 flows)

---

## Direct Cross-Dataset Comparison Table

| Dataset | Metric | Production (`class_weight=None`) | Experimental (`class_weight="balanced"`) | Change |
| :--- | :--- | :--- | :--- | :--- |
| DDoS | Binary Accuracy | 99.86% | 99.86% | +0.00% |
| DDoS | Attack Recall | 99.98% | 99.98% | +0.00% |
| DDoS | Multiclass Accuracy | 99.80% | 99.91% | +0.11% |
| DDoS | Macro Precision | 19.99% | 33.33% | +13.34% |
| DDoS | Macro Recall | 19.96% | 33.30% | +13.34% |
| DDoS | Macro F1 | 19.98% | 33.31% | +13.34% |
| DDoS | Weighted F1 | 99.88% | 99.95% | +0.07% |
| DDoS | DDoS Precision | 99.99% | 100.00% | +0.00% |
| DDoS | DDoS Recall | 99.81% | 99.98% | +0.16% |
| DDoS | DDoS F1 | 99.90% | 99.99% | +0.08% |
| PortScan | Binary Accuracy | 99.78% | 99.78% | +0.00% |
| PortScan | Attack Recall | 99.99% | 99.99% | +0.00% |
| PortScan | Multiclass Accuracy | 99.56% | 99.79% | +0.23% |
| PortScan | Macro Precision | 14.28% | 25.00% | +10.71% |
| PortScan | Macro Recall | 14.22% | 24.94% | +10.72% |
| PortScan | Macro F1 | 14.25% | 24.97% | +10.72% |
| PortScan | Weighted F1 | 99.78% | 99.89% | +0.11% |
| PortScan | PortScan Precision | 100.00% | 100.00% | +0.00% |
| PortScan | PortScan Recall | 99.61% | 99.97% | +0.36% |
| PortScan | PortScan F1 | 99.80% | 99.98% | +0.18% |
| WebAttacks | Binary Accuracy | 99.97% | 99.97% | +0.00% |
| WebAttacks | Attack Recall | 99.59% | 99.59% | +0.00% |
| WebAttacks | Multiclass Accuracy | 99.45% | 99.77% | +0.32% |
| WebAttacks | Macro Precision | 24.40% | 35.93% | +11.53% |
| WebAttacks | Macro Recall | 32.54% | 35.73% | +3.20% |
| WebAttacks | Macro F1 | 24.28% | 35.60% | +11.32% |
| WebAttacks | Weighted F1 | 99.48% | 99.78% | +0.30% |
| WebAttacks | Web Attack - Brute Force Precision | 85.78% | 93.85% | +8.07% |
| WebAttacks | Web Attack - Brute Force Recall | 50.83% | 80.03% | +29.20% |
| WebAttacks | Web Attack - Brute Force F1 | 63.83% | 86.39% | +22.56% |
| WebAttacks | Web Attack - XSS Precision | 45.63% | 65.43% | +19.80% |
| WebAttacks | Web Attack - XSS Recall | 74.54% | 86.81% | +12.27% |
| WebAttacks | Web Attack - XSS F1 | 56.61% | 74.62% | +18.01% |
| WebAttacks | Web Attack - Sql Injection Precision | 12.57% | 100.00% | +87.43% |
| WebAttacks | Web Attack - Sql Injection Recall | 100.00% | 90.48% | -9.52% |
| WebAttacks | Web Attack - Sql Injection F1 | 22.34% | 95.00% | +72.66% |

---

## Key Performance Insights by Dataset

### 1. DDoS Dataset (225,745 flows)
- **Binary Accuracy & Attack Recall**: Identical (**99.86%** & **99.98%**).
- **Multiclass Accuracy**: Production = **99.80%** → Balanced = **99.91%** (+0.11%).
- **DDoS Specific Performance**: Precision = **100.00%**, Recall = **99.98%**, F1-Score = **99.99%** (+0.08%).

### 2. PortScan Dataset (286,467 flows)
- **Binary Accuracy & Attack Recall**: Identical (**99.78%** & **99.99%**).
- **Multiclass Accuracy**: Production = **99.56%** → Balanced = **99.79%** (+0.23%).
- **PortScan Specific Performance**: Precision = **100.00%**, Recall = **99.97%**, F1-Score = **99.98%** (+0.18%).

### 3. WebAttacks Dataset (170,366 flows)
- **Multiclass Accuracy**: Improved from **99.45%** → **99.77%** (**+0.32%**).
- **Macro F1-Score**: Improved from **24.28%** → **35.60%** (**+11.32%**).
- **Brute Force F1-Score**: Improved from **63.83%** → **86.39%** (**+22.56%**).
- **XSS F1-Score**: Improved from **56.61%** → **74.62%** (**+18.01%**).
- **SQL Injection F1-Score**: Improved from **22.34%** → **95.00%** (**+72.66%**).

---

## Sanity Checks & Non-Deployment Verification
- [x] Production `.joblib` model files untouched: **PASSED**
- [x] Production `ModelService` codebase untouched: **PASSED**
- [x] Production `preprocessing_service.py` codebase untouched: **PASSED**
- [x] Frontend codebase untouched: **PASSED**
- [x] Experimental model saved separately: **PASSED**
- [x] Prediction count equals CSV row count on all datasets: **PASSED**
- [x] Zero NaN or Inf passed to model: **PASSED**
- [x] Exact 46 feature input vector used: **PASSED**

---

## Factual Summary
1. **Zero Regression on Major Attack Classes**: Applying `class_weight="balanced"` caused **0.00% metric regression** on DDoS and PortScan benchmarks, maintaining near-perfect performance (~99.8% F1-Score).
2. **Massive Performance Gains on Web Attacks**: On the WebAttacks dataset, class weighting substantially boosted F1-Scores across all three rare Web Attack sub-classes without degrading DDoS or PortScan accuracy.
