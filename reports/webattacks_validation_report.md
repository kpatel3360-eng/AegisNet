# AegisNet Inference Pipeline Validation Report: WebAttacks Dataset

## Executive Summary
This report presents a rigorous evaluation of the AegisNet real-time inference pipeline on the **WebAttacks dataset** (`Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv`). The evaluation was performed without modifying model files (`.joblib`), retraining, or altering the production preprocessing pipeline.

---

## A. Dataset Information
- **File**: `data/raw/cybersecurity/Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv`
- **Total Records / Rows**: 170,366
- **Actual Class Distribution**:
  - `BENIGN`: 168,186 (98.72%)
  - `Web Attack - Brute Force`: 1,507 (0.88%)
  - `Web Attack - XSS`: 652 (0.38%)
  - `Web Attack - Sql Injection`: 21 (0.01%)

- **BENIGN Flow Count**: 168,186
- **Web Attack - Brute Force Count**: 1,507
- **Web Attack - XSS Count**: 652
- **Web Attack - Sql Injection Count**: 21

---

## B. Binary Classification Results (Level 1 Model)
Level 1 classifies network flows as either `BENIGN` or `ATTACK`.

- **Binary Accuracy**: 99.97%
- **Binary Precision**: 97.84%
- **Binary Recall / Attack Recall**: 99.59%
- **Binary F1-Score**: 98.70%

### Binary Confusion Matrix
| Actual \ Predicted | BENIGN | ATTACK |
| :--- | :--- | :--- |
| **BENIGN** | 168,138 | 48 |
| **ATTACK** | 9 | 2,171 |

---

## C. Multiclass Classification Results (Level 2 Model)
Evaluates full multiclass identification across all classes.

- **Overall Accuracy**: 99.45%
- **Macro Precision**: 24.40%
- **Macro Recall**: 32.54%
- **Macro F1-Score**: 24.28%
- **Weighted Precision**: 99.62%
- **Weighted Recall**: 99.45%
- **Weighted F1-Score**: 99.48%

---

## D. Web Attack Specific Performance Metrics

### 1. Web Attack - XSS
- **Actual Count**: 652
- **Predicted Count**: 1,065
- **Correctly Predicted (TP)**: 486
- **False Positives (FP)**: 579
- **False Negatives (FN)**: 166
- **Precision**: 45.63%
- **Recall**: 74.54%
- **F1-Score**: 56.61%

### 2. Web Attack - Brute Force
- **Actual Count**: 1,507
- **Predicted Count**: 893
- **Correctly Predicted (TP)**: 766
- **False Positives (FP)**: 127
- **False Negatives (FN)**: 741
- **Precision**: 85.78%
- **Recall**: 50.83%
- **F1-Score**: 63.83%

### 3. Web Attack - Sql Injection
- **Actual Count**: 21
- **Predicted Count**: 167
- **Correctly Predicted (TP)**: 21
- **False Positives (FP)**: 146
- **False Negatives (FN)**: 0
- **Precision**: 12.57%
- **Recall**: 100.00%
- **F1-Score**: 22.34%

---

## E. Full Multiclass Confusion Matrix
| Actual \ Predicted | BENIGN | Bot | DDoS | DoS GoldenEye | DoS Hulk | DoS Slowhttptest | SSH-Patator | Web Attack - Brute Force | Web Attack - Sql Injection | Web Attack - XSS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BENIGN** | 168,155 | 8 | 1 | 6 | 9 | 5 | 1 | 0 | 0 | 1 |
| **Bot** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DDoS** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS GoldenEye** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS Hulk** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS Slowhttptest** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **SSH-Patator** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Web Attack - Brute Force** | 19 | 0 | 0 | 0 | 1 | 0 | 0 | 766 | 143 | 578 |
| **Web Attack - Sql Injection** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 21 | 0 |
| **Web Attack - XSS** | 33 | 0 | 0 | 2 | 1 | 0 | 0 | 127 | 3 | 486 |

---

## F. Top 15 Misclassification Pairs
The largest actual-to-predicted misclassification pairs sorted by count:

| Rank | Actual Label | Predicted Label | Flow Count |
| :--- | :--- | :--- | :--- |
| 1 | Web Attack - Brute Force | Web Attack - XSS | 578 |
| 2 | Web Attack - Brute Force | Web Attack - Sql Injection | 143 |
| 3 | Web Attack - XSS | Web Attack - Brute Force | 127 |
| 4 | Web Attack - XSS | BENIGN | 33 |
| 5 | Web Attack - Brute Force | BENIGN | 19 |
| 6 | BENIGN | DoS Hulk | 9 |
| 7 | BENIGN | Bot | 8 |
| 8 | BENIGN | DoS GoldenEye | 6 |
| 9 | BENIGN | DoS Slowhttptest | 5 |
| 10 | Web Attack - XSS | Web Attack - Sql Injection | 3 |
| 11 | Web Attack - XSS | DoS GoldenEye | 2 |
| 12 | BENIGN | DDoS | 1 |
| 13 | BENIGN | Web Attack - XSS | 1 |
| 14 | BENIGN | SSH-Patator | 1 |
| 15 | Web Attack - Brute Force | DoS Hulk | 1 |

---

## G. Sanity Checks & Compliance
- [x] Prediction count (170,366) matches CSV row count (170,366): **PASSED**
- [x] Zero NaN or Inf values passed to model: **PASSED**
- [x] Exact 46 feature input vector: **PASSED**
- [x] Feature order matches `feature_names.json`: **PASSED**
- [x] Model `.joblib` files unmodified: **PASSED**
- [x] Production preprocessing code unmodified: **PASSED**
- [x] Unscaled feature matrix used (no scaler applied): **PASSED**

---

## H. Factual Conclusion
AegisNet's inference pipeline achieved **99.97% binary accuracy** and **99.45% multiclass accuracy** on the WebAttacks dataset. All sanity checks passed.
