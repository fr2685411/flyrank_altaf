# ML-09: Validation Audit & Claim Discipline Report

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Primary Metric:** Precision@50 under temporal shift

---

## 1. Sealed Month Evaluation (June 2026 Shift)

To audit real-world resilience against Google algorithm volatility, the model was tested blind against June 2026 data where the positive decline label rate dropped from **54.2%** to **43.8%**:

| Model | Pre-June Test Precision@50 | June Sealed Test Precision@50 | Retention Rate |
|---|---:|---:|---:|
| **Random Forest** | **0.740** | **0.680** | **91.9%** |
| **Decision Tree** | 0.540 | 0.440 | 81.5% |
| **Baseline Heuristic Rules** | 0.240 | 0.180 | 75.0% |

**Finding:** The Random Forest retains 91.9% of its ranking precision during major SERP volatility (+55% lift over June's 43.8% base rate), whereas rule baselines collapse to 0.180.

---

## 2. Claim Ladder Enforcement

All documentation adheres to the 4-tier Claim Ladder:
1. **Observed:** *"In the 30,000-page dataset, pages unmodified for >180 days exhibited a 61.4% decline rate."*
2. **Directional:** *"Low CTR on Page 1 rankings is strongly associated with subsequent click loss."*
3. **Decision-Support:** *"The Random Forest model prioritizes refresh candidates with 0.740 Precision@50."*
4. **Causal Claims Strictly Banned:** No statements that "refreshing causes rankings to improve" or "we predicted Google's algorithm."
