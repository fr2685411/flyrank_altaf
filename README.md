# FlyRank Applied Search Intelligence Platform

An Early-Warning Queue & Intelligence Platform for Organic Search Content Decline, featuring the **Three Front Doors** publication system, interactive queue explorer, model benchmark evaluation, and real-time refresh opportunity simulator.

## Overview

FlyRank Applied Search Intelligence solves the editorial challenge of prioritizing organic search content for refresh review. Rather than relying on simple decay heuristics or unranked manual discovery, the platform applies a machine-learned ranking system (Random Forest, Precision@50: 0.740, +208% lift over baseline) calibrated to predict continued organic click loss.

### Core Features

1. **One Capstone, Three Front Doors**:
   - **Door 1 (ML Engineers & Technical Reviewers)**: Rigorous technical research paper with mathematical foundations, client-holdout validation, ROC AUC analysis, and failure mode policies.
   - **Door 2 (Employers & Technical Interviews)**: Result-first portfolio case study highlighting the 0.74 P@50 lift, the end-to-end data pipeline, and the June algorithm shift experiment.
   - **Door 3 (SEO Community & Editorial Leaders)**: Action-oriented playbook detailing the TL;DR, high-yield editorial moves, traps to avoid, and realistic ROI scenario models.
   - **Interactive Switcher & Sync-Scroll**: View each door individually or compare all 3 side-by-side with synchronized scrolling.

2. **Live Refresh Queue Explorer**:
   - Filter and search scored pages by Action (`refresh_and_review_ctr`, `refresh`, `refresh_and_review_engagement`, `expand_and_refresh`, `monitor`), Confidence (`high`, `medium`, `low`), Trend, and Position Tier.
   - Deep-dive Inspector Drawer providing all 28 telemetry metrics, model probability vs. baseline score breakdown, triggered reason codes, and editorial checklists.

3. **Content Refresh Opportunity Simulator**:
   - Interactive calculator implementing the exact FlyRank scoring formulas.
   - Adjust 10 parameters (impressions, avg position, CTR, content age, days since update, word count, sessions, trend, engagement, scroll rate) or load real archetypes to test scoring and recommended actions in real time.

4. **Model Benchmarks & Evidence Dashboard**:
   - Comparative evaluation matrix: Random Forest vs. Decision Tree vs. Logistic Regression vs. Baseline Rules.
   - Feature importance rankings and interactive pipeline SVG charts.
   - Analysis of the "Sealed Month" (June algorithm shift).

5. **Data Contract & Leakage Defenses**:
   - Documentation of the 5-point data contract and 44 signal dictionary.
   - Explicit audit explaining the exclusion of raw URLs, titles, and target keywords to prevent target leakage and client memorization.

6. **SEO ROI & Review Capacity Planner**:
   - Model the monthly labor savings (1.3 hrs/page saved) and reclaimed organic traffic value based on team size and review bandwidth.

## Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Type check
npm run lint
```
