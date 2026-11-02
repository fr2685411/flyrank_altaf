# ML-02: Research Question & Problem Framing

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Repo:** `fr2685411/flyrank_altaf`
- **Evaluation Metric:** Precision@50 (vs 54.2% Base Rate)

---

## 1. Problem Framing

### 1.1 What decision does this improve?
Rather than trying to "predict Google's algorithm", this model improves an operational decision: **prioritizing which published URLs an editorial team should inspect and refresh first** to prevent continued loss of organic search traffic.

### 1.2 Who acts on the output, and what do they do?
- **The Actor:** FlyRank content strategists and client editorial reviewers.
- **The Action:** Reviewers inspect the top-ranked queue items and execute targeted editorial interventions based on attached reason codes:
  - `refresh_and_review_ctr`: Revise title tag and meta description for SERP intent alignment.
  - `refresh_and_review_engagement`: Improve above-the-fold layout and visual media to reduce bounce rates.
  - `expand_and_refresh`: Deepen thin articles (<1,200 words) retaining high visibility.
  - `refresh`: Update outdated facts, figures, links, and republish with fresh timestamp.
  - `monitor`: Stable or low-demand assets; maintain observation without allocating editorial budget.

### 1.3 What does a wrong answer cost?
- **False Positive (healthy page flagged in top 50):** 1.5–2.0 hours of expensive editorial labor ($45–$70/hr) wasted auditing content that did not need changes.
- **False Negative (declining high-demand page missed):** Irreversible loss of Page 1 rankings (slipping into pages 2+), forfeiting hundreds of high-intent organic clicks per month.

### 1.4 Why does data/ML help over fixed rules?
Fixed heuristics (e.g. `days_since_update >= 180 and impressions >= 500`) either overwhelm reviewers with unranked lists or miss subtle early-warning decay signatures where position is held but CTR and engagement are deteriorating. ML captures non-linear interactions across freshness, CTR, position, and scroll depth across diverse client verticals.

---

## 2. Canonical One-Paragraph Frame

> For FlyRank content strategists and client editorial teams, deciding which published search articles to refresh first, we will build a prioritized decision-support ranking queue from 90-day search console and analytics telemetry across 32 clients, scoring the probability of forward 30-day click decline (`is_declining_label`) measured by **Precision@50** against a 54.2% base rate. A wrong call costs wasted editorial labor on stable pages or missed organic traffic on decaying high-value assets. A plain rule isn't enough because search decay stems from non-linear interactions between freshness, position, and user engagement. We will claim only observed, measured, directional, and decision-support results.

---

## 3. Rubric Pass Criteria Checklist (ML-02)

- [x] Decision clearly named: Triage priority queue for content refresh.
- [x] Actor & concrete actions specified.
- [x] Costs of false positives and false negatives quantified.
- [x] Justification for ML over fixed rules documented.
- [x] Unit of analysis defined: `content_id` grouped by `client_id`.
- [x] Selection metric pre-specified: Precision@50 (capacity-aligned).
- [x] Base rate explicitly reported: 54.2% (16,262 declining items / 30,000 total).
- [x] Strict adherence to honest claim vocabulary (observed, measured, directional, decision-support).
