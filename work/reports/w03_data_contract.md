# ML-04 & ML-05: Data Contract & Leakage Audit Report

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Dataset:** Starter Anonymized Release (`data/raw/content_refresh_anonymized.csv`)

---

## 1. Data Contract Governance

### 1.1 Unit of Analysis & Integrity
- **Grain:** One row per published content asset (`content_id`), uniquely belonging to a client domain (`client_id`).
- **Assertion:** Zero duplicate `content_id` instances across all 30,000 rows.
- **Monotonic Rules:**
  - $\text{impressions\_90d} \ge \text{clicks\_90d} \ge 0$
  - $\text{days\_with\_impressions} \le 90$
  - $\text{content\_age\_days} \ge \text{days\_since\_last\_update} \ge 0$

### 1.2 Four-Way Field Classification

```text
30,000 Total Rows × 44 Columns
├── Bucket A: Permitted Features (X) [34 Signals]
│   ├── Search Console: impressions_90d, clicks_90d, avg_position, ctr, days_with_impressions...
│   ├── Sub-Window Dynamics: impressions_last_30d, impressions_prev_30d, clicks_last_30d...
│   ├── GA4 Analytics: sessions_90d, users_90d, engaged_sessions_90d, scroll_events_90d...
│   ├── Structural Metadata: content_age_days, days_since_last_update, word_count, char_count...
│   └── Categorical Tiers: competition_level, content_type, main_intent, position_tier...
├── Bucket B: Target Outcome (y) [1 Signal]
│   └── is_declining_label (Forward 30d organic click drop >= 15%, Base Rate: 54.2%)
├── Bucket C: Context / Grouping [2 Signals]
│   ├── content_id (Unique asset primary key)
│   └── client_id (Grouped train/test split variable; NEVER a feature)
└── Bucket D: Strictly Excluded / Banned [7 Signals]
    ├── trend_direction, trend_pct (Label-derived direct target leakage)
    ├── provider_used, model_used (Internal generation markers)
    └── health_score, product flags (Decision-derived circular features)
```

---

## 2. Attack-Your-Own-Model Leakage Experiments

### 2.1 The Confession Test: Label Leakage
- **With `trend_direction`:** ROC AUC = **0.992**, Precision@50 = **1.000**.
- **Without `trend_direction`:** ROC AUC = **0.750**, Precision@50 = **0.740**.
- **Finding:** A 24.2-point ROC AUC collapse proves `trend_direction` is direct target leakage. It is strictly quarantined.

### 2.2 Random Split vs. Grouped Client Holdout
- **Naive Random Split:** ROC AUC = **0.842**, Precision@50 = **0.820**.
- **Grouped Client Holdout:** ROC AUC = **0.750**, Precision@50 = **0.740**.
- **Finding:** The 9.2-point drop reveals that random splits allow the model to memorize client-specific domain authority. Grouped holdout enforces honest evaluation on unseen client websites.

---

## 3. Invariants & Missingness Gotchas

1. **`avg_position = 0` means "No rank recorded"**: 1,205 rows have no ranking data. Imputed as 51.0 with an indicator flag `has_position_data = False`.
2. **Rates are $\times 100$ percentages**: `ctr = 0.76` indicates $0.76\%$, not $76\%$.
3. **`scroll_rate > 100`**: Telemetry artifact from dual asynchronous instrumentation (scroll events vs session starts). Handled via clipping.
4. **Patterned Missingness**: Missing search volume on specific content types is preserved via `has_search_volume` indicator flags rather than naive zero-filling.
