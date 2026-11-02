# ML-03: ML Task Framing & Label Mechanics

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Repo:** `fr2685411/flyrank_altaf`
- **Primary Metric:** Precision@50 (vs 54.2% Base Rate)

---

## 1. Task Type: Priority Ranking Over Discrete Classification

A standard binary classifier generates a discrete binary output $\hat{y} \in \{0, 1\}$ at a fixed threshold (e.g., $p \ge 0.5$). In an editorial setting, this fails because human review bandwidth is strictly capacity-constrained (typically 50 articles per weekly cycle):
- A discrete classifier returning 8,000 flagged items overwhelms the team.
- A discrete classifier returning 5 items starves reviewer capacity.

Therefore, we formalize the problem as a **priority ranking task**:
1. The model estimates the posterior risk probability of future organic click decline $\hat{p}_i = P(y_i = 1 \mid \mathbf{x}_i)$.
2. Items are rank-ordered descending by $\hat{p}_i$.
3. The top $K=50$ items are delivered to reviewers as the weekly priority batch.

---

## 2. Temporal Window & Target Definition

```text
FEATURE OBSERVATION WINDOW (90 Days)            EVALUATION HORIZON (30 Days)
[================== T_-90 to T_0 ==================] | [====== T_0 to T_+30 ======]
  - Impressions, Clicks, GA4 Sessions                 - Forward organic clicks
  - Average SERP Position                             - Target: is_declining_label
  - Content Age, Staleness (Days Since Update)          (Click drop >= 15%)
  - Engagement & Scroll Telemetry
```

### 2.1 Target Formula
$$\text{is\_declining\_label}_i = \begin{cases} 1 & \text{if } \frac{\text{Clicks}_{i, [T_0, T_{+30}]} - \text{Clicks}_{i, [T_{-30}, T_0]}}{\text{Clicks}_{i, [T_{-30}, T_0]} + \epsilon} \le -0.15 \\[6pt] 0 & \text{otherwise} \end{cases}$$

### 2.2 Base Rate Measurement
- Total items scored: **30,000**
- Positive label items (`is_declining_label = 1`): **16,262**
- **Empirical Base Rate:** **54.2%**

---

## 3. Leakage & Circularity Defense

1. **The `trend_direction` and `trend_pct` Trap:**
   - In the raw dataset, `trend_direction` is computed directly from forward click trajectories.
   - Including `trend_direction` as an input feature gives a deceptive 0.992 ROC AUC, but collapses in production because the future trend is unobserved at time $T_0$.
   - **Enforced Policy:** `trend_direction` and `trend_pct` are **strictly excluded** from model inputs.

2. **The Product Flags Circularity Trap:**
   - Existing rules (`health_score`, `quick_win_flag`) encode legacy human decisions.
   - Feeding them into training causes the model to mimic existing rules rather than discovering organic decay patterns in telemetry.
   - **Enforced Policy:** Product flags serve as baselines to beat, never feature inputs.

---

## 4. Evaluation Metric Justification: Precision@50

- **Raw Accuracy:** Rejected. A trivial majority-class dummy model achieves 54.2% without ordering items.
- **ROC AUC:** Secondary diagnostic only. Measures discrimination across all 30,000 ranks, treating errors at rank #15,000 the same as errors at rank #5.
- **Precision@50:** **Primary selection metric.** Evaluates the density of truly declining assets in the exact 50-item queue presented to reviewers each cycle:
  $$\text{Precision@}50 = \frac{1}{50} \sum_{i=1}^{50} y_{\pi(i)}$$

---

## 5. Validation Architecture: Grouped Client Holdout

- **Split Variable:** `client_id` (32 distinct client portfolios).
- **Rationale:** Random row splitting causes data leakage because articles under the same client share domain authority, technical SEO templates, and brand elasticity. Grouping by client tests true out-of-sample generalization.
