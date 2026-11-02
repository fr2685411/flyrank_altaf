# ML-08: Model Training & Comparison Report

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Primary Selection Metric:** Precision@50 (vs 54.2% Base Rate)

---

## 1. Unified Model Comparison Matrix

All models evaluated under **Grouped Client Holdout** on the identical test split:

| Model Architecture | ROC AUC | Avg Precision | Precision@50 | Recall | F1 | Status |
|---|---:|---:|---:|---:|---:|---|
| **Random Forest** | **0.750** | **0.618** | **0.740** | **0.744** | **0.640** | ✅ **Selected Production Best** |
| **Decision Tree** | 0.742 | 0.575 | 0.540 | 0.716 | 0.634 | Evaluated |
| **Logistic Regression** | 0.700 | 0.522 | 0.400 | 0.567 | 0.566 | Evaluated |
| **Baseline Heuristic Rules** | 0.627 | 0.468 | 0.240 | — | — | Benchmark Floor |
| *(Majority-Class Random Floor)* | *0.500* | *0.542* | *0.542* | *1.000* | *0.703* | Uninformative Floor |

---

## 2. Key Findings

1. **Precision@50 Breakthrough:**
   - Random Forest delivers **0.740 Precision@50** (37 out of 50 prioritized pages truly declined), yielding a **+208% lift over the rule baseline** (0.240) and a **+36.5% lift over the majority-class base rate** (0.542).
2. **Top Predictive Drivers:**
   - `days_with_impressions` (0.1578) and `log_impressions_90d` (0.1282) dominate, proving that persistent active search visibility is the foundational requirement for detecting high-impact decay.
   - `avg_position` (0.1090) and `content_age_days` (0.0955) represent the primary decaying levers.
3. **Error Analysis & Policy Translation:**
   - Identified the Seasonal Slump false positive; created an operational rule to cross-check client seasonality before re-writing articles.
   - Low-volume false negatives (<200 impressions) accepted as beneficial triage behavior, preserving reviewer hours for high-yield pages.
