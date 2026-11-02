# ML-06 & ML-07: Signal Audit & Baseline Score Report

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Repo:** `fr2685411/flyrank_altaf`
- **Primary Metric:** Precision@50 (vs 54.2% Base Rate)

---

## 1. Signal Audit (ML-06 Summary)

| Signal | Hypothesis | Observed Contrast ($n$) | Verdict |
|---|---|---|---|
| `days_since_last_update` | Staleness increases decay risk | 61.4% (stale) vs 44.8% (fresh) ($n=30,000$) | **CONFIRMED** |
| `word_count` | Length protects against decay | 54.0% (>2k words) vs 55.1% (<1k words) ($n=30,000$) | **FALSE** |
| `ctr` on Page 1 | Low CTR leads to drop | 64.8% (low CTR) vs 48.2% (healthy CTR) ($n=16,970$) | **CONFIRMED** |
| `scroll_rate` | Low engagement leads to drop | 62.3% (<30%) vs 49.1% (≥30%) ($n=12,030$) | **CONFIRMED** |

---

## 2. Transparent Rule Baseline (ML-07)

$$\text{Baseline Score} = 0.40 \cdot S_{\text{vis}} + 0.30 \cdot S_{\text{fresh}} + 0.25 \cdot S_{\text{pos}} + 0.05 \cdot S_{\text{depth}}$$

### 2.1 Benchmark Results (Held-Out Client Split)
- **Precision@50:** **0.240** (Only 12 out of top 50 pages are actually declining)
- **ROC AUC:** **0.627**
- **Average Precision:** **0.468**
- **Majority-Class Base Rate:** **0.542**

### 2.2 Why the Rule Baseline Underperforms
Manual review of the baseline's top 20 ranked pages reveals that volume and calendar age dominate the formula. The heuristic repeatedly flags massive, authoritative evergreen articles that have high visibility and age but are completely stable in search traffic. Subtle, early-stage decay on high-intent articles is buried far down the list.
