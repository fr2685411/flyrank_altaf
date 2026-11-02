# ML-10: Action Playbook & Editorial Integration Report

- **Track:** Applied Search Intelligence: Google Search Ranking & Discoverability
- **Lane:** Refresh / Content Opportunity Scoring
- **Author:** Altaf (ML Intern)
- **Primary Deliverable:** Operational Action Queue & Triage Protocols

---

## 1. Five Operational Actions

| Action | Trigger Conditions | Editorial Intervention Protocol | Queue Volume |
|---|---|---|---:|
| `refresh_and_review_ctr` | Visible (pos $\le 20$, imp $\ge 500$) + CTR $<0.5\%$ + decline risk | Overhaul SERP title hook, meta description, and FAQ schema | 6,657 (22.2%) |
| `refresh_and_review_engagement` | Sessions $\ge 30$ + (scroll $<30\%$ or engagement $<30\%$) | Improve above-the-fold layout, add TOC, remove layout shifts | 1,990 (6.6%) |
| `expand_and_refresh` | Thin content (<1,200 words) with persistent search demand | Add missing subtopics, practical examples, and FAQ sections | 82 (0.3%) |
| `refresh` | Proven demand (imp $\ge 500$) + staleness/decay signals | Update outdated statistics, verify broken links, fresh timestamp | 8,178 (27.3%) |
| `monitor` | Steady traffic or low demand (<100 impressions) | No intervention; maintain observation for next cycle | 13,093 (43.6%) |

---

## 2. Confidence Tiering Rules

- **High Confidence (3,605 items / 12.0%):** Score $\ge 80.0$, impressions $\ge 500$, sessions $\ge 10$, model prob $\ge 0.50$. Reviewers focus strictly on this pool.
- **Medium Confidence (11,395 items / 38.0%):** Score $\ge 60.0$. Secondary backlog.
- **Low Confidence (15,000 items / 50.0%):** Score $< 60.0$. Suppressed from triage queues to eliminate editorial fatigue.

---

## 3. Final Blended Refresh Score Formula

$$\text{Final Refresh Score} = 100 \cdot \Big(0.70 \cdot \hat{p}_{\text{model}} + 0.30 \cdot S_{\text{baseline}}\Big) \in [0, 100]$$
