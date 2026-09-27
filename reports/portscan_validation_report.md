# AegisNet Inference Pipeline Validation Report: PortScan Dataset

## Executive Summary
This report presents a rigorous evaluation of the AegisNet real-time inference pipeline on the **PortScan dataset** (`Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv`). The evaluation was conducted without modifying any machine learning model files (`.joblib`), retraining models, or changing the production inference pipeline.

---

## A. Dataset Information
- **File**: `data/raw/cybersecurity/Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv`
- **Total Records / Rows**: 286,467
- **Actual Class Distribution**:
  - `PortScan`: 158,930 (55.48%)
  - `BENIGN`: 127,537 (44.52%)

- **BENIGN Flow Count**: 127,537
- **PortScan Flow Count**: 158,930

---

## B. Binary Classification Results (Level 1 Model)
Level 1 classifies network flows as either `BENIGN` or `ATTACK`.

- **Binary Accuracy**: 99.78%
- **Attack Precision**: 99.60%
- **Attack Recall**: 99.99%
- **Attack F1-Score**: 99.80%

### Binary Confusion Matrix
| Actual \ Predicted | BENIGN | ATTACK |
| :--- | :--- | :--- |
| **BENIGN** | 126,904 | 633 |
| **ATTACK** | 9 | 158,921 |

---

## C. Multiclass Classification Results (Level 2 Model)
Evaluates full multiclass identification across all classes present in the dataset.

- **Overall Accuracy**: 99.56%
- **Macro Precision**: 14.28%
- **Macro Recall**: 14.22%
- **Macro F1-Score**: 14.25%
- **Weighted Precision**: 99.99%
- **Weighted Recall**: 99.56%
- **Weighted F1-Score**: 99.78%

---

## D. PortScan-Specific Performance Metrics
- **Actual PortScan Count**: 158,930
- **Predicted PortScan Count**: 158,306
- **Correctly Predicted PortScan (TP)**: 158,306
- **PortScan False Negatives (FN)**: 624
- **PortScan False Positives (FP)**: 0
- **PortScan Precision**: 100.00%
- **PortScan Recall**: 99.61%
- **PortScan F1-Score**: 99.80%

---

## E. Full Confusion Matrix
| Actual \ Predicted | BENIGN | Bot | DDoS | DoS GoldenEye | DoS Hulk | DoS Slowhttptest | DoS slowloris | FTP-Patator | Infiltration | PortScan | SSH-Patator | Web Attack - Brute Force | Web Attack - Sql Injection | Web Attack - XSS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BENIGN** | 126,911 | 606 | 0 | 1 | 12 | 4 | 0 | 1 | 2 | 0 | 0 | 0 | 0 | 0 |
| **Bot** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DDoS** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS GoldenEye** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS Hulk** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS Slowhttptest** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **DoS slowloris** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **FTP-Patator** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Infiltration** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **PortScan** | 19 | 0 | 4 | 3 | 135 | 1 | 1 | 3 | 359 | 158,306 | 17 | 23 | 52 | 7 |
| **SSH-Patator** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Web Attack - Brute Force** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Web Attack - Sql Injection** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Web Attack - XSS** | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

---

## F. Misclassification Analysis
The largest actual-to-predicted misclassification pairs sorted by volume:

| Rank | Actual Label | Predicted Label | Flow Count |
| :--- | :--- | :--- | :--- |
| 1 | BENIGN | Bot | 606 |
| 2 | PortScan | Infiltration | 359 |
| 3 | PortScan | DoS Hulk | 135 |
| 4 | PortScan | Web Attack - Sql Injection | 52 |
| 5 | PortScan | Web Attack - Brute Force | 23 |
| 6 | PortScan | BENIGN | 19 |
| 7 | PortScan | SSH-Patator | 17 |
| 8 | BENIGN | DoS Hulk | 12 |
| 9 | PortScan | Web Attack - XSS | 7 |
| 10 | BENIGN | DoS Slowhttptest | 4 |
| 11 | PortScan | DDoS | 4 |
| 12 | PortScan | DoS GoldenEye | 3 |
| 13 | PortScan | FTP-Patator | 3 |
| 14 | BENIGN | Infiltration | 2 |
| 15 | BENIGN | DoS GoldenEye | 1 |
| 16 | BENIGN | FTP-Patator | 1 |
| 17 | PortScan | DoS Slowhttptest | 1 |
| 18 | PortScan | DoS slowloris | 1 |

---

## G. Sanity Checks & Compliance
- [x] Prediction count (286,467) matches CSV row count (286,467): **PASSED**
- [x] Zero NaN or Inf values passed to inference: **PASSED**
- [x] Exact 46 feature input vector: **PASSED**
- [x] Feature order matches `feature_names.json`: **PASSED**
- [x] Model `.joblib` files unmodified: **PASSED**
- [x] Preprocessing codebase unmodified: **PASSED**
- [x] Unscaled feature matrix used for tree classifier: **PASSED**

---

## H. Factual Conclusion & Comparison with DDoS Validation

### Comparison against DDoS Dataset Validation:
- **DDoS Validation Results**:
  - Binary Accuracy: **99.86%**
  - Attack Recall: **99.98%**
  - Multiclass Accuracy: **99.80%**

- **PortScan Validation Results**:
  - Binary Accuracy: **99.78%**
  - Attack Recall: **99.99%**
  - Multiclass Accuracy: **99.56%**
  - PortScan F1-Score: **99.80%**

### Conclusion:
The AegisNet inference pipeline demonstrates exceptional performance on the PortScan dataset, achieving **99.78% binary accuracy** and **99.56% multiclass accuracy**, with a **99.61% PortScan recall** and **99.80% PortScan F1-score**. All sanity checks passed cleanly.
