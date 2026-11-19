# An Early-Warning Queue for Organic Click Decline
### Client-Grouped & Time-Forward Evaluation of a Decision-Support Ranker

- **Author:** Altaf (ML Intern)
- **Track:** Applied Search Intelligence — Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Dataset:** 30,000 Anonymized Pages (32 Clients) + 78.8M-Row Warehouse (`FlyRank/internship-warehouse`)
- **Primary Metric:** Precision@50 = **0.740** (+208% Lift vs. 0.240 Rule Baseline; 54.2% Base Rate)

---

## Slide 1: Title & Core Thesis

### Out of thousands of aging articles, which should an editor fix *first*?

- **The Reality:** Content ranks in Google Search, then quietly decays. Most teams notice months after high-intent clicks have evaporated.
- **The Solution:** A calibrated Random Forest priority ranker evaluated strictly on unseen client domains (`client_holdout`) and a sealed future month.
- **Headline Result:** **0.740 Precision@50** — 37 of the top 50 prioritized pages genuinely suffered forward 30-day click loss, compared to just 12 under existing heuristic rules.

> **Speaker Notes (0:00–0:30):** Welcome. Over the past 8 weeks, I built an early-warning decision-support ranker for FlyRank. The goal wasn't to "predict Google's algorithm," but to solve an acute editorial bottleneck: deciding which decaying articles an editorial team should review first.

---

## Slide 2: The Operational Triage Dilemma

### Bounded Human Capacity vs. Portfolio Scale

| Operational Constraint | Empirical Scale / Impact |
|---|---|
| **Portfolio Size** | 30,000 published pages in starter slice (519,606 in warehouse) |
| **Editorial Capacity** | ~50 deep content reviews per weekly sprint |
| **Cost of a False Positive** | 1.5–2.0 hours of wasted audit labor ($45–$70/hr) on stable pages |
| **Cost of a False Negative** | Slipping from Page 1 (#3) to Page 2 (#14), losing high-intent clicks |

- **Task Framing:** Priority ranking by posterior decline risk $\hat{p}(y=1 \mid \mathbf{x})$, not hard binary thresholding.

> **Speaker Notes (0:30–1:00):** A discrete yes/no classifier fails here: flagging 8,000 pages overwhelms editors, while flagging 5 wastes capacity. Ranking orders the portfolio so the top 50 pages match weekly editorial bandwidth.

---

## Slide 3: The Transparent Baseline & Its Failure Mode

### Why Hand-Written Rules Score Worse Than Random Guessing

$$\text{Baseline Score} = 0.40 \cdot S_{\text{vis}} + 0.30 \cdot S_{\text{fresh}} + 0.25 \cdot S_{\text{pos}} + 0.05 \cdot S_{\text{depth}}$$

- **Baseline Performance (Held-out clients):**
  - **Precision@50:** **0.240** (12 / 50 hits — below the **0.542** majority-class base rate)
  - **ROC AUC:** **0.627**
- **The "Giant Evergreen" Trap (Top-20 Hand Review):**
  - High impression volume and calendar age dominate the formula.
  - The rule repeatedly flags massive, authoritative evergreen guides that are completely stable, burying early-stage decay on smaller high-intent pages down at ranks #500+.

> **Speaker Notes (1:00–1:30):** Before training any ML model, we built a transparent 4-signal heuristic baseline. Surprisingly, it only scored 0.24 Precision@50. Inspecting its top 20 picks showed why: it obsessively flagged old, high-traffic evergreen guides that weren't actually declining.

---

## Slide 4: Data Safety, Contract & The Confession Test

### Strict Leakage Quarantine & Client-Holdout Validation

- **44-Column Data Contract:** 34 safe trailing-90d telemetry features, 1 observed target (`is_declining_label`: $\ge 15\%$ forward click drop), 2 context IDs (`content_id`, `client_id`), 7 strictly banned columns.
- **Attack Experiment 1 — The Confession Test:**
  - With `trend_direction`: **0.992 ROC AUC / 1.000 P@50** (Direct outcome-window leakage!)
  - Without `trend_direction`: **0.750 ROC AUC / 0.740 P@50** (Honest production signal)
- **Attack Experiment 2 — Split Integrity:**
  - Naive Random Split: **0.842 ROC AUC** (Memorizes client domain authority)
  - Grouped Client Holdout: **0.750 ROC AUC** (9.2-point memorization gap exposed)
- **Privacy Guarantee:** Zero client names, raw URLs, page titles, or raw search queries.

> **Speaker Notes (1:30–2:15):** Search data is full of traps. We proved `trend_direction` is pure target leakage via the Confession Test, and enforced a Grouped Client Holdout so the model must generalize to completely unseen client websites.

---

## Slide 5: Signal Audit Verdicts (What Actually Predicts Decay)

### Hypothesis Testing Across 30,000 Pages ($n \ge 50$ Floors)

| Signal Hypothesis | Observed Comparison | Verdict |
|---|---|---|
| **Staleness ($\ge 180$d since update)** | 61.4% decline ($n=14,210$) vs. 44.8% fresh ($n=6,850$) | **CONFIRMED** |
| **Low CTR ($<0.5\%$) on Visible Page 1** | 64.8% decline ($n=4,120$) vs. 48.2% healthy ($n=12,850$) | **CONFIRMED** |
| **Low Scroll Rate ($<30\%$, $\ge 30$ sessions)** | 62.3% decline ($n=3,890$) vs. 49.1% engaged ($n=8,140$) | **CONFIRMED** |
| **Long Content ($>2,000$ words) Protects** | 54.0% decline ($n=6,470$) vs. 55.1% short ($n=7,420$) | **FALSE** |

- **Negative Result:** Article word count alone offers virtually zero protection against click decay once information grows stale.

> **Speaker Notes (2:15–2:45):** Our EDA signal audit confirmed staleness, low Page-1 CTR, and low scroll depth as strong decay correlates—while disproving the popular SEO myth that 2,000+ word articles are immune to decay.

---

## Slide 6: Model Benchmark Comparison

### Random Forest Delivers +208% Lift at Capacity ($K=50$)

| Candidate Model | ROC AUC | Avg Precision | Precision@50 | Recall | F1 | Status |
|---|---:|---:|---:|---:|---:|---|
| **Random Forest** | **0.750** | **0.618** | **0.740** | **0.744** | **0.640** | **Selected Best** |
| **Decision Tree** | 0.742 | 0.575 | 0.540 | 0.716 | 0.634 | Evaluated |
| **Logistic Regression** | 0.700 | 0.522 | 0.400 | 0.567 | 0.566 | Evaluated |
| **Baseline Heuristic Rules** | 0.627 | 0.468 | 0.240 | — | — | Benchmark Floor |
| *Base Rate (Random Floor)* | *0.500* | *0.542* | *0.542* | — | — | *Majority-Class* |

- **Top Gini Drivers:** `days_with_impressions` (0.1578), `log_impressions_90d` (0.1282), `avg_position` (0.1090), `content_age_days` (0.0955).

> **Speaker Notes (2:45–3:20):** On unseen clients, Random Forest hits 0.740 Precision@50—more than triple the rule baseline and nearly 20 points above the 54.2% base rate. Search consistency and impression magnitude lead the feature importances.

---

## Slide 7: The "Sealed Month" Audit (June 2026 Core Shift)

### Retaining 91.9% Precision Under Real Algorithmic Volatility

- **The Stress Test:** Evaluated the frozen Jan–May model blindly on the **sealed June 2026 partition**.
- **Macro Shift:** Core SERP volatility pushed the overall decline base rate down from **54.2%** to **43.8%**.
- **Sealed Month Results:**
  - **Random Forest Precision@50:** **0.680** (**91.9% retention**, +55% relative lift over June base rate)
  - **Decision Tree Precision@50:** **0.440**
  - **Baseline Rules Precision@50:** **0.180** (Collapsed)
- **Error Analysis -> Policy:** Seasonal Q4/June slumps caused false positives; promoted to a reviewer check (*verify seasonality calendar before full rewrite*).

> **Speaker Notes (3:20–3:55):** When evaluated blindly on June 2026 during an algorithm shift where the base rate dropped 10 points, the rule baseline collapsed to 0.18, while Random Forest retained 0.68 Precision@50.

---

## Slide 8: Action Playbook & Confidence Gating

### Turning Risk Probabilities into 5 Editorial Decisions

$$\text{Final Refresh Score} = 100 \cdot \Big(0.70 \cdot \hat{p}_{\text{model}} + 0.30 \cdot S_{\text{baseline}}\Big) \in [0, 100]$$

| Action Code | 30k Queue Share | Trigger & Editorial Triage Protocol |
|---|---|---|
| `refresh_and_review_ctr` | **6,657** (22.2%) | Pos $\le 20$, imp $\ge 500$, CTR $<0.5\%$ $\rightarrow$ Title/meta/FAQ schema overhaul |
| `refresh` | **8,178** (27.3%) | Proven demand + decay/staleness $\rightarrow$ Update facts, links & timestamp |
| `refresh_and_review_engagement` | **1,990** (6.6%) | Sessions $\ge 30$, scroll/eng $<30\%$ $\rightarrow$ Above-the-fold TOC & visual fix |
| `expand_and_refresh` | **82** (0.3%) | Thin ($<1,200$ words) + impressions $\rightarrow$ Topical depth expansion |
| `monitor` | **13,093** (43.6%) | Stable or low demand $\rightarrow$ Observe next 30-day cycle |

- **Confidence Filter:** Isolates **3,605 High-Confidence items** (12.0%) for top-50 weekly sprints; suppresses 15,000 low-confidence rows.

> **Speaker Notes (3:55–4:25):** Editors don't want raw probabilities; they need concrete tasks. Every flagged item outputs reason codes and maps to one of five playbooks, gated by strict confidence thresholds.

---

## Slide 9: Operational Efficiency & Honest Claim Discipline

### Measurable Decision-Support Value Without Causal Overreach

- **Audit Efficiency Gain:** Reduces per-page audit discovery time from **2.2 hrs** (manual spreadsheet/GSC sifting) to **0.9 hrs** (**1.3 hours saved per page**).
- **Modeled Monthly Scenario (50 pages/week-cycle):** ~65 editorial hours saved monthly + prioritized protection of at-risk organic clicks.
- **Claim Ladder Discipline:**
  - **Allowed:** *Observed*, *measured*, *associated with*, *decision-support priority queue*.
  - **Strictly Banned:** *"We predicted Google's algorithm"*, *"refreshing causes +X% ranking lift"* (requires controlled A/B experiment).

> **Speaker Notes (4:25–4:45):** In practice, pre-computed reason codes save over an hour of manual triage per page. We maintain strict scientific honesty: this is a predictive decision-support system, not a causal claim about Google's ranking engine.

---

## Slide 10: Reproducibility, Deployed Platform & Credit

### Full-Stack Delivery & Warehouse Readiness

- **Interactive Web Platform:** Built in React + TypeScript featuring the **Three Front Doors** publication reader, **200-item Live Queue Explorer**, **Real-Time Refresh Simulator**, **Benchmarks Suite**, and **ROI Planner**.
- **78.8M-Row Warehouse Integration:** Zero-download DuckDB SQL aggregation over remote Hugging Face Parquet partitions (`hf://datasets/FlyRank/internship-warehouse`).
- **Reproducibility:** Fixed `seed=42`, complete weekly notebooks (`work/notebooks/w01`–`capstone.ipynb`), and submission pointer (`submission/paper_url.txt`).
- **Data Credit:** Built on the **FlyRank ML Internship** dataset ([https://flyrank.ai](https://flyrank.ai)).

> **Speaker Notes (4:45–5:00):** Everything is reproducible with fixed seeds, backed by complete weekly notebooks, a DuckDB warehouse pipeline for 79M rows, and deployed in this interactive application. Built on the FlyRank ML Internship dataset. Thank you!
