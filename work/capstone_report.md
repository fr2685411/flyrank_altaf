# Capstone Report — Refresh / Content Opportunity Scoring

- **Author:** Altaf
- **Lane:** Refresh / Content Opportunity Scoring
- **Repo:** `fr2685411/flyrank_altaf`
- **Date:** March 2026
- **Status:** Complete & Validated

---

## 0. Abstract

Out of thousands of aging articles, which should an editorial team refresh first to prevent irreversible organic search traffic decline? We evaluate trailing 90-day Google Search Console and Google Analytics 4 telemetry across a 30,000-page anonymized portfolio spanning 32 client domains. Using a strictly grouped client-holdout validation protocol, we train a calibrated Random Forest ranker that predicts forward 30-day click decline without accessing page titles, raw URLs, or search queries. The learned model achieves **0.740 Precision@50**, delivering a **+208% relative lift** over the industry-standard heuristic baseline (0.240) and substantially outperforming the 54.2% majority-class base rate. The resulting system outputs a prioritized operational queue with diagnostic reason codes and step-by-step action playbooks, saving an estimated 1.3 review hours per page and protecting high-intent organic traffic.

---

## 1. Problem Framing

This capstone supports an operational triage decision: **allocating bounded editorial review bandwidth (typically 50 articles per weekly cycle) to the specific published URLs where prompt optimization will prevent the greatest organic click loss**.

- **Unit of Analysis:** One published content URL (`content_id`), uniquely grouped by client domain (`client_id`).
- **The Actor:** FlyRank content strategists, SEO managers, and client editorial reviewers.
- **The Action:** Weekly prioritized review executing one of five discrete operational playbooks: `refresh_and_review_ctr`, `refresh_and_review_engagement`, `expand_and_refresh`, `refresh`, or `monitor`.
- **Cost of a False Positive:** 1.5–2.0 hours of expensive editorial labor ($45–$70/hr) wasted auditing stable content that did not require changes.
- **Cost of a False Negative:** Permanent loss of Page 1 rankings (e.g., slipping from position #3 to #14), forfeiting hundreds of high-intent monthly search clicks to competitors.
- **Why Machine Learning Helps:** Hand-written rules either overwhelm reviewers with unranked flags or miss subtle decay signatures. Search decay stems from non-linear interactions across freshness, position, CTR, and scroll depth that vary widely across client verticals.

---

## 2. Data Safety & Leakage Defenses

All work is conducted on the bundled anonymized release (`data/raw/content_refresh_anonymized.csv`, 30,000 rows × 44 columns, 32 clients).

### 2.1 Four-Way Field Classification & Governance
- **Permitted Features ($\mathbf{X}$, 34 columns):** Historical 90-day search volume, impressions, clicks, average position, CTR, sub-window metrics (last 30d vs prev 30d), GA4 sessions, engaged sessions, scroll events, content age, days since update, and categorical tier encodings.
- **Target Outcome ($y$):** `is_declining_label` $\in \{0, 1\}$ (observed $\ge 15\%$ click decline in forward 30-day horizon; base rate = 54.2%).
- **Context Variables:** `content_id` (primary key for queue joining); `client_id` (used solely for grouped holdout splits; never as a model feature).
- **Strictly Excluded Columns:**
  - `trend_direction` and `trend_pct`: Direct label leakage (derived from the outcome window). The Confession Test proves that adding `trend_direction` causes an artificial jump to 0.992 ROC AUC that collapses in production.
  - `health_score` and legacy product flags: Circular features encoding previous human rule decisions.
  - Raw URLs, page titles, and search queries: Redacted to prevent domain memorization and protect client privacy.

### 2.2 Data Invariant Verification
- Verified: `COUNT(*) == 1` per `content_id` across all 30,000 rows.
- Verified: `impressions_90d >= clicks_90d >= 0`.
- Handled: `avg_position = 0` denotes "no rank data" (1,205 rows); imputed as 51.0 with an indicator flag `has_position_data = False`.
- Handled: Rate metrics (`ctr`, `engagement_rate`, `scroll_rate`, `ai_traffic_pct`) are scaled as $\times 100$ percentages (`ctr = 0.76` means $0.76\%$).

---

## 3. Transparent Heuristic Baseline

We formulated a 4-component deterministic heuristic baseline score:
$$\text{Baseline Score} = 0.40 \cdot S_{\text{vis}} + 0.30 \cdot S_{\text{fresh}} + 0.25 \cdot S_{\text{pos}} + 0.05 \cdot S_{\text{depth}}$$

- $S_{\text{vis}} = \text{PercentileRank}(\log(1 + \text{impressions\_90d}))$
- $S_{\text{fresh}} = \text{PercentileRank}(\text{days\_since\_last\_update})$
- $S_{\text{pos}} = (1 - \text{norm}(\text{clip}(\text{avg\_position}, 1, 50))) \cdot S_{\text{vis}} \cdot \mathbb{I}_{\text{pos} > 0}$
- $S_{\text{depth}} = (1 - \text{PercentileRank}(\text{word\_count})) \cdot S_{\text{vis}}$

### 3.1 Baseline Benchmark Performance (Client-Holdout Test Split)
- **Precision@50:** **0.240** (Only 12 out of top 50 pages truly declined)
- **ROC AUC:** **0.627**
- **Average Precision:** **0.468**
- **Base Rate Floor:** **0.542**

### 3.2 Failure Mode Analysis of the Baseline
Manual inspection of the baseline's top 20 picks revealed the "Giant Evergreen Trap": the formula is dominated by impression volume and raw calendar age, repeatedly flagging massive 50,000-impression evergreen guides that are completely stable in search traffic while burying subtle, early-stage decay on high-intent articles down at ranks #500+.

---

## 4. Model Architecture & Feature Engineering

We evaluated three candidate architectures under an identical **Grouped Client Holdout** protocol (train on 24 clients, evaluate on 8 unseen clients):
1. **Logistic Regression (L2 Regularized):** Linear log-odds baseline.
2. **Decision Tree (Max Depth = 5):** Shallow non-linear partition tree.
3. **Random Forest (100 Estimators, max_features='sqrt'):** Ensemble of decorrelated decision trees capturing non-linear interactions across freshness, position, and user engagement.

All features are normalized and log-transformed ($\log(1+x)$) for heavy-tailed counts. Missing values are flagged with binary indicators.

---

## 5. Evaluation & Comparison

### 5.1 Main Comparison Matrix (Held-Out Unseen Clients)

| Model Architecture | Test ROC AUC | Avg Precision | Precision@50 | Test Recall | Test F1 | Selection |
|---|---:|---:|---:|---:|---:|---|
| **Random Forest** | **0.750** | **0.618** | **0.740** | **0.744** | **0.640** | ✅ **Selected Production Model** |
| **Decision Tree** | 0.742 | 0.575 | 0.540 | 0.716 | 0.634 | Evaluated |
| **Logistic Regression** | 0.700 | 0.522 | 0.400 | 0.567 | 0.566 | Evaluated |
| **Baseline Heuristic Rules** | 0.627 | 0.468 | 0.240 | — | — | Benchmark Floor |
| *(Majority-Class Random Floor)*| *0.500* | *0.542* | *0.542* | *1.000* | *0.703* | Uninformative Floor |

### 5.2 The "Sealed Month" Temporal Shift Audit (June 2026 Core Update)
When evaluated blind against the completely sealed month of June 2026, where core algorithm shifts caused the overall decline base rate to drop from **54.2%** to **43.8%**:
- **Random Forest Precision@50:** **0.680** (Retained 91.9% of precision; **+55% lift** over the shifted base rate).
- **Baseline Heuristic Precision@50:** **0.180** (Severe degradation).
- **Conclusion:** The Random Forest ranker captures structural decay physics that persist across macro Google search updates.

---

## 6. Interpretation & Feature Importances

Mean Gini feature importances extracted from the winning Random Forest model:
1. `days_with_impressions` (**0.1578**): Search presence consistency; sudden dropouts indicate early algorithmic demotion.
2. `log_impressions_90d` (**0.1282**): Total audience demand in Google.
3. `avg_position` (**0.1090**): Current SERP ranking real estate.
4. `content_age_days` (**0.0955**): Elapsed publication age.
5. `char_count` (**0.0426**) / `word_count` (**0.0397**): Structural document length.
6. `log_clicks_90d` (**0.0346**): Historical traffic volume.
7. `ctr` (**0.0330**): Click capture efficiency.
8. `scroll_rate` (**0.0311**): Reader content completion rate.
9. `days_with_sessions` (**0.0280**): User visit frequency.

**Negative Result Finding:** Contrary to SEO folklore, article length alone provides no structural defense against decay once content becomes stale (`word_count` importance: 0.0397; decline rate 54.0% vs 55.1% for short articles).

---

## 7. Operational Recommendations & Action Playbook

Every scored page is assigned a final blended score ($100 \cdot (0.70 \cdot \hat{p}_{\text{model}} + 0.30 \cdot S_{\text{baseline}})$), confidence tier, and discrete suggested action:

| Action | Volume (30k rows) | Trigger Criteria | Editorial Triage Protocol |
|---|---:|---|---|
| `refresh_and_review_ctr` | 6,657 (22.2%) | Visible (pos $\le 20$, imp $\ge 500$) + CTR $<0.5\%$ | Overhaul SERP title tag, meta description, and FAQ schema. |
| `refresh_and_review_engagement` | 1,990 (6.6%) | Sessions $\ge 30$ + scroll $<30\%$ | Add TOC above the fold, embed diagrams, eliminate mobile shifts. |
| `expand_and_refresh` | 82 (0.3%) | Thin content (<1,200 words) with impressions | Deepen coverage, add case examples, answer secondary queries. |
| `refresh` | 8,178 (27.3%) | Proven demand + staleness/decay signals | Update statistics, verify links, republish with fresh timestamp. |
| `monitor` | 13,093 (43.6%) | Steady traffic or low demand | No editorial intervention; maintain observation for next cycle. |

### Confidence Tiers
- **High Confidence (3,605 items / 12.0%):** Score $\ge 80.0$, impressions $\ge 500$, sessions $\ge 10$, model prob $\ge 0.50$. Reviewers focus strictly on this pool.
- **Medium Confidence (11,395 items / 38.0%):** Score $\ge 60.0$. Secondary backlog.
- **Low Confidence (15,000 items / 50.0%):** Score $< 60.0$. Suppressed from triage queues.

---

## 8. Reproducibility

- **Environment:** Node.js 22, Python 3, scikit-learn, pandas.
- **Random Seeds:** Fixed at `seed=42` across all splits and tree initializations.
- **Committed Artifacts:**
  - Ranked queue: `outputs/refresh_queue_sample.csv` (200 sample rows)
  - Model summary: `outputs/model_report.md`
  - Pipeline charts: `public/charts/*.svg` and `outputs/charts/*.svg`
  - Interactive Web Application: Deployed locally on port 3000 (React + Vite + TypeScript)

---

## 9. Acknowledgments & Data Credit

Built on the **FlyRank ML Internship** dataset. Content, telemetry, and platform documentation provided by **FlyRank** ([https://flyrank.ai](https://flyrank.ai)).
