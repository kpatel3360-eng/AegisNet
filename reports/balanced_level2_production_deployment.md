# AegisNet Level-2 Balanced Model Production Deployment Report

## Executive Summary
This report documents the controlled production deployment of the **Validated Class-Weighted Level-2 Multiclass Model** (`class_weight="balanced"`) for AegisNet. The deployment was executed cleanly after passing offline WebAttack validation, cross-dataset regression testing, and production smoke tests across all three cybersecurity benchmark datasets.

> [!NOTE]
> **Rollback Readiness**: A byte-for-byte backup of the previous unweighted production model has been archived at `models/backups/multiclass_random_forest_pre_balanced.joblib` and the original model file `models/multiclass_random_forest.joblib` remains untouched.

---

## 1. Deployment Details & Model Specification
- **Previous Production Model**: `models/multiclass_random_forest.joblib` (`LGBMClassifier`, `class_weight=None`)
- **New Production Model**: `models/multiclass_random_forest_balanced.joblib` (`LGBMClassifier`, `class_weight="balanced"`)
- **Backup Location**: `models/backups/multiclass_random_forest_pre_balanced.joblib` (4,878,060 bytes, SHA256 verified)
- **Configuration Update**: `backend/config.py` updated to set `MULTICLASS_MODEL_PATH` to `models/multiclass_random_forest_balanced.joblib`.
- **Model Metadata**: `models/model_metadata.json` updated to record `class_weight="balanced"`.

---

## 2. Production Smoke Test Results

### A. DDoS Dataset (`Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv`)
- **Total Input Rows**: 225,745
- **Evaluated Flows**: 225,745 (100% match)
- **Benign Flows**: 97,467
- **Attack Flows**: 128,278
- **Threat Rate**: 56.82%
- **Most Common Attack**: DDoS (127,994 flows)
- **Status**: **PASSED**

### B. PortScan Dataset (`Friday-WorkingHours-Afternoon-PortScan.pcap_ISCX.csv`)
- **Total Input Rows**: 286,467
- **Evaluated Flows**: 286,467 (100% match)
- **Benign Flows**: 126,913
- **Attack Flows**: 159,554
- **Threat Rate**: 55.70%
- **Most Common Attack**: PortScan (158,881 flows)
- **Status**: **PASSED**

### C. WebAttacks Dataset (`Thursday-WorkingHours-Morning-WebAttacks.pcap_ISCX.csv`)
- **Total Input Rows**: 170,366
- **Evaluated Flows**: 170,366 (100% match)
- **Benign Flows**: 168,147
- **Attack Flows**: 2,219
- **Threat Rate**: 1.30%
- **Most Common Attack**: Web Attack - Brute Force (1,285 flows)
- **Detected Attack Distribution**:
  - `Web Attack - Brute Force`: **1,285 flows**
  - `Web Attack - XSS`: **865 flows**
  - `Web Attack - Sql Injection`: **19 flows**
- **Status**: **PASSED**

---

## 3. Web Attacks Expected Behavior Verification
- **Brute Force → XSS Confusion**: Reduced from 578 -> **299** (-48.27%)
- **Brute Force → SQL Injection Confusion**: Reduced from 143 -> **0** (100% eliminated)
- **XSS → Brute Force Confusion**: Reduced from 127 -> **78** (-38.58%)
- **SQL Injection Precision**: Improved from 12.57% -> **100.00%**
- **Overall Multiclass Accuracy**: Improved from 99.45% -> **99.77%**

---

## 4. Frontend & Model Loading Verification
- `ModelService` reloaded all models cleanly without errors:
  - Level-1 Binary Model: **Loaded**
  - Level-2 Balanced Model: **Loaded** (`class_weight="balanced"`)
  - Traffic Forecaster Model: **Loaded**
  - Feature Names (46): **Loaded**
  - Label Encoder: **Loaded**
- Frontend integration verified: `/api/dashboard/summary` and `/api/analytics/analyze-csv` endpoints produce valid dynamic JSON data consumed directly by the React dashboard components.

---

## 5. Rollback Status
- **Rollback Required**: **NO**
- **Rollback Plan**: In the event of an issue, revert `backend/config.py` `MULTICLASS_MODEL_PATH` back to `models/multiclass_random_forest.joblib` or restore from `models/backups/multiclass_random_forest_pre_balanced.joblib`.

---

## 6. Summary Status

**DEPLOYMENT STATUS**: **SUCCESS**

**CURRENT LEVEL-2 MODEL**: `c:\Users\kpate\OneDrive\Documents\AegisNet\models\multiclass_random_forest_balanced.joblib`

**BACKUP MODEL**: `c:\Users\kpate\OneDrive\Documents\AegisNet\models\backups\multiclass_random_forest_pre_balanced.joblib`

**FILES MODIFIED**:
- `backend/config.py`
- `models/model_metadata.json`

**FILES CREATED**:
- `models/backups/multiclass_random_forest_pre_balanced.joblib`
- `models/multiclass_random_forest_balanced.joblib`
- `reports/balanced_level2_production_deployment.md`
