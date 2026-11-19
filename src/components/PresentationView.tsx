import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FileText,
  Download,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  Printer,
} from 'lucide-react';
import { ActiveTab } from './Navigation';
import { downloadPresentationPdf } from '../utils/presentationPdf';

interface PresentationViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

interface SlideDefinition {
  id: number;
  chapter: string;
  title: string;
  subtitle: string;
  timing: string;
  speakerNotes: string;
  ctaLabel?: string;
  ctaTab?: ActiveTab;
  renderBody: (onNavigateTab: (tab: ActiveTab) => void) => React.ReactNode;
}

const MARKDOWN_EXPORT = `# An Early-Warning Queue for Organic Click Decline
### Client-Grouped & Time-Forward Evaluation of a Decision-Support Ranker

Author: Altaf (ML Intern)
Track: Applied Search Intelligence — Google Search Ranking & Discoverability
Lane: Refresh / Content Opportunity Scoring
Dataset: 30,000 Anonymized Pages (32 Clients) + 78.8M-Row Warehouse (FlyRank/internship-warehouse)
Primary Metric: Precision@50 = 0.740 (+208% Lift vs. 0.240 Rule Baseline; 54.2% Base Rate)

---

## Slide 1: Title & Core Thesis
Out of thousands of aging articles, which should an editor fix FIRST?
- Problem: Content ranks in Google Search, then quietly decays.
- Method: Calibrated Random Forest priority ranker evaluated on unseen clients (client_holdout) and a sealed future month.
- Headline Result: 0.740 Precision@50 (37/50 hits vs 12/50 under heuristic rules).

---

## Slide 2: The Operational Triage Dilemma
- Portfolio Size: 30,000 pages in starter release (519,606 in warehouse)
- Editorial Capacity: ~50 deep content reviews per weekly sprint
- False Positive Cost: 1.5–2.0 hours wasted audit labor ($45–$70/hr) on stable pages
- False Negative Cost: Slipping from Page 1 (#3) to Page 2 (#14), losing high-intent clicks
- Framing: Priority ranking by posterior risk p(y=1 | x), not binary thresholding.

---

## Slide 3: The Transparent Baseline & Failure Mode
Baseline Score = 0.40 * S_vis + 0.30 * S_fresh + 0.25 * S_pos + 0.05 * S_depth
- Precision@50: 0.240 (12/50 hits, below the 0.542 majority-class base rate)
- ROC AUC: 0.627
- Failure Mode ("Giant Evergreen Trap"): High impressions and calendar age over-flag stable evergreen guides while burying subtle early-stage decay.

---

## Slide 4: Data Governance & The Confession Test
- 44-Column Contract: 34 safe trailing-90d features, 1 target (is_declining_label: >=15% drop), 2 context IDs, 7 banned columns.
- Confession Test: With trend_direction -> 0.992 ROC AUC (Leakage). Without -> 0.750 ROC AUC (Honest).
- Split Audit: Random Split (0.842 AUC) vs Grouped Client Holdout (0.750 AUC) exposes 9.2-point client memorization gap.

---

## Slide 5: Signal Audit Verdicts (n = 30,000)
- Staleness >=180d: 61.4% decline vs 44.8% fresh -> CONFIRMED
- Low CTR (<0.5%) on Page 1: 64.8% decline vs 48.2% healthy -> CONFIRMED
- Low Scroll (<30%, >=30 sessions): 62.3% decline vs 49.1% engaged -> CONFIRMED
- Long Content (>2,000 words) Protects: 54.0% vs 55.1% -> FALSE (No structural barrier)

---

## Slide 6: Model Benchmark Comparison
- Random Forest: 0.750 ROC AUC | 0.618 PR AUC | 0.740 P@50 | 0.744 Recall | 0.640 F1 (Selected Best)
- Decision Tree: 0.742 ROC AUC | 0.575 PR AUC | 0.540 P@50
- Logistic Regression: 0.700 ROC AUC | 0.522 PR AUC | 0.400 P@50
- Baseline Heuristic Rules: 0.627 ROC AUC | 0.468 PR AUC | 0.240 P@50

---

## Slide 7: Sealed Month Audit (June 2026 Core Shift)
- Macro Shift: Overall decline base rate shifted from 54.2% down to 43.8%.
- Random Forest Precision@50: 0.680 (91.9% retention, +55% over shifted base rate)
- Baseline Rules Precision@50: 0.180 (Collapsed)

---

## Slide 8: Action Playbook & Confidence Gating
Final Refresh Score = 100 * (0.70 * model_prob + 0.30 * baseline_norm)
- refresh_and_review_ctr: 6,657 (22.2%)
- refresh: 8,178 (27.3%)
- refresh_and_review_engagement: 1,990 (6.6%)
- expand_and_refresh: 82 (0.3%)
- monitor: 13,093 (43.6%)
Confidence Filter isolates 3,605 High-Confidence targets (12.0%) for top-50 sprints.

---

## Slide 9: Operational Efficiency & Claim Discipline
- Audit Time Saved: 2.2 hrs/page manual discovery -> 0.9 hrs/page (1.3 hours saved/page).
- Claim Ladder: Observed, measured, directional, decision-support only. Zero causal claims.

---

## Slide 10: Reproducibility & Data Credit
- Interactive React Platform: Three Front Doors, Queue Explorer, Simulator, Benchmarks, ROI Planner.
- Warehouse Pipeline: Remote DuckDB over Hugging Face Parquet (78.8M rows).
- Built on the FlyRank ML Internship dataset (https://flyrank.ai).
`;

export const PresentationView: React.FC<PresentationViewProps> = ({ onNavigateTab }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [gridView, setGridView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: SlideDefinition[] = [
    {
      id: 1,
      chapter: '01 · Thesis',
      title: 'An Early-Warning Queue for Organic Click Decline',
      subtitle:
        'Client-grouped and time-forward evaluation of a decision-support ranker across 30,000 anonymized search assets.',
      timing: '0:00 – 0:30',
      speakerNotes:
        'Open with the editorial dilemma: content ranks in Google Search, then quietly decays. Our goal is not to predict Google’s algorithm, but to solve a real triage bottleneck—helping editors choose which 50 pages to inspect first each week.',
      ctaLabel: 'Explore Three Front Doors',
      ctaTab: 'doors',
      renderBody: () => (
        <div className="flex flex-col justify-between h-full gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Out of thousands of aging articles, which ones should an editorial team refresh{' '}
                <span className="text-white font-semibold underline decoration-teal-400 underline-offset-4">
                  first
                </span>{' '}
                to prevent avoidable organic click loss?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Validation Standard</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Grouped Client Holdout + Sealed Month
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    32 distinct client domains · Zero domain memorization
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-xs text-slate-400">Warehouse Readiness</div>
                  <div className="text-sm font-semibold text-white mt-1">
                    30k Starter · 78.8M Warehouse
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    DuckDB remote Parquet · Zero raw URLs or PII
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-center space-y-5">
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  Headline Selection Metric · Precision@50
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-5xl font-bold font-mono tabular-nums text-teal-400">
                    0.740
                  </span>
                  <span className="text-sm text-slate-400 font-mono tabular-nums">
                    vs 0.240 rule baseline
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-2">
                  +208% lift over heuristic baseline · +36.5% over 54.2% base rate
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-slate-400">ROC AUC</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                    0.750
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">PR AUC</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-white mt-0.5">
                    0.618
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">June Sealed</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-teal-300 mt-0.5">
                    0.680
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              Altaf · Applied Search Intelligence Track · Refresh Opportunity Scoring Lane
            </div>
            <div className="font-mono tabular-nums text-slate-300">
              Built on FlyRank ML Internship Dataset · Seed 42
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      chapter: '02 · Problem Framing',
      title: 'The Operational Triage Dilemma',
      subtitle:
        'Why editorial refresh prioritization is a capacity-bounded ranking problem, not a binary classifier.',
      timing: '0:30 – 1:00',
      speakerNotes:
        'Explain why raw classification thresholds break in editorial workflows. Flagging 8,000 pages overwhelms reviewers who can only inspect 50 pages per week. Ranking aligns the ML output directly with weekly review sprints.',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-center">
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">01. The Decision &amp; Actor</div>
              <h3 className="text-base font-bold text-white">
                Allocating Bounded Weekly Editorial Bandwidth
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Content strategists and SEO reviewers can deeply audit roughly{' '}
                <span className="font-mono tabular-nums text-white font-semibold">50 URLs</span> per
                weekly cycle out of a portfolio of{' '}
                <span className="font-mono tabular-nums text-white font-semibold">30,000+</span>{' '}
                published pages.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400">02. Asymmetric Cost of Errors</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-amber-300">False Positive Cost</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    1.5–2.0 hours of wasted audit labor ($45–$70/hr) inspecting stable content.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-rose-300">False Negative Cost</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Irreversible slip from Page 1 (#3) to Page 2 (#14), losing high-intent clicks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950/70 border border-slate-800 rounded-xl p-6 flex flex-col justify-center space-y-5">
            <div>
              <div className="text-xs text-slate-400 mb-2">Temporal Alignment &amp; Target</div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Observation Window (90d)</span>
                  <span>Outcome Horizon (30d)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-teal-500/30 border border-teal-500/50 rounded-l" />
                  <span className="text-white font-bold">T₀</span>
                  <div className="w-1/3 h-2.5 bg-amber-500/30 border border-amber-500/50 rounded-r" />
                </div>
                <div className="text-[11px] text-slate-300 pt-1">
                  Target: is_declining_label = 1 if forward 30d click drop ≥ 15%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Starter Rows Scored</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                  30,000
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Empirical Base Rate</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-teal-400 mt-1">
                  54.2%
                </div>
                <div className="text-[11px] text-slate-400">16,262 declining pages</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      chapter: '03 · Heuristic Baseline',
      title: 'Why Fixed Rules Fail: The "Giant Evergreen" Trap',
      subtitle:
        'A transparent 4-signal baseline establishes the honest floor—and reveals why static SEO rules misfire.',
      timing: '1:00 – 1:30',
      speakerNotes:
        'Walk through the frozen deterministic rule baseline. Emphasize the top-20 hand review finding: volume and calendar age dominate simple linear weights, flagging massive healthy evergreen guides while burying subtle decay.',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-7 space-y-5 flex flex-col justify-center">
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-400">Frozen Deterministic Heuristic Formula</div>
              <div className="font-mono text-sm text-teal-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                Score = 0.40·Visibility + 0.30·Freshness + 0.25·Position + 0.05·DepthGap
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div>
                  <div className="font-mono font-bold text-white">40%</div>
                  <div className="text-slate-400">log(Impressions)</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-white">30%</div>
                  <div className="text-slate-400">Days Since Update</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-white">25%</div>
                  <div className="text-slate-400">SERP Position Opp.</div>
                </div>
                <div>
                  <div className="font-mono font-bold text-white">5%</div>
                  <div className="text-slate-400">Thin Content Gap</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs text-amber-300 font-semibold">
                Top-20 Hand Review Diagnosis
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Manually auditing the baseline&apos;s top 20 ranks uncovered the{' '}
                <strong className="text-white">Giant Evergreen Trap</strong>: the formula heavily
                over-indexes on high-impression, older authoritative guides that are{' '}
                <em>completely stable</em>. True early-stage decay on mid-volume commercial pages is
                pushed below rank #500.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-center space-y-6">
            <div>
              <div className="text-xs text-slate-400">Baseline Precision@50</div>
              <div className="text-5xl font-bold font-mono tabular-nums text-rose-400 mt-2">
                0.240
              </div>
              <div className="text-xs text-slate-300 mt-2">
                Only <span className="font-mono font-bold text-white">12 of 50</span> flagged
                pages actually declined — performing worse than the{' '}
                <span className="font-mono font-bold text-slate-200">0.542</span> random base rate.
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-400">Baseline ROC AUC</div>
                <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
                  0.627
                </div>
              </div>
              <div>
                <div className="text-slate-400">Avg Precision (PR)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-white mt-1">
                  0.468
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      chapter: '04 · Data Contract & Leakage',
      title: 'Attacking Our Own Model: The Confession Test',
      subtitle:
        'Strict 44-column field governance, leakage quarantine, and grouped client-holdout validation.',
      timing: '1:30 – 2:15',
      speakerNotes:
        'Show how we prevented target leakage and domain memorization. The Confession Test proved trend_direction leaked future outcomes (0.992 AUC -> 0.750 AUC). Grouping by client_id eliminated a 9.2-point memorization illusion.',
      ctaLabel: 'Inspect Data Contract',
      ctaTab: 'contract',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-slate-400 mb-3">
                Experiment 1 · Label Leakage Confession Test
              </div>
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="border-b border-slate-800 text-slate-400 font-sans">
                  <tr>
                    <th className="py-2">Model Run</th>
                    <th className="py-2 text-right">ROC AUC</th>
                    <th className="py-2 text-right">P@50</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  <tr>
                    <td className="py-3 text-rose-300">With trend_direction (Leaky)</td>
                    <td className="py-3 text-right font-bold text-rose-300">0.992</td>
                    <td className="py-3 text-right font-bold text-rose-300">1.000</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-teal-300">Quarantined (Honest Features)</td>
                    <td className="py-3 text-right font-bold text-teal-300">0.750</td>
                    <td className="py-3 text-right font-bold text-teal-300">0.740</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              A 24.2-point ROC AUC collapse confirms{' '}
              <code className="font-mono text-teal-300">trend_direction</code> and{' '}
              <code className="font-mono text-teal-300">trend_pct</code> encode future outcomes.
              Both—plus legacy product flags—are strictly banned from feature matrix X.
            </p>
          </div>

          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-slate-400 mb-3">
                Experiment 2 · Random Split vs. Grouped Client Holdout
              </div>
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead className="border-b border-slate-800 text-slate-400 font-sans">
                  <tr>
                    <th className="py-2">Split Strategy</th>
                    <th className="py-2 text-right">ROC AUC</th>
                    <th className="py-2 text-right">P@50</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  <tr>
                    <td className="py-3 text-amber-300">Naive Random 80/20 Split</td>
                    <td className="py-3 text-right font-bold text-amber-300">0.842</td>
                    <td className="py-3 text-right font-bold text-amber-300">0.820</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-teal-300">Grouped Client Holdout (8 unseen)</td>
                    <td className="py-3 text-right font-bold text-teal-300">0.750</td>
                    <td className="py-3 text-right font-bold text-teal-300">0.740</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              The 9.2-point AUC gap exposes domain-authority memorization under random splits.
              Zero raw URLs, page titles, client names, or search keywords enter the model.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      chapter: '05 · Signal Audit',
      title: 'Signal Audit Verdicts Across 30,000 Pages',
      subtitle:
        'Testing four search intelligence hypotheses with strict sample-size floors (n ≥ 50) and log-scaled traffic.',
      timing: '2:15 – 2:45',
      speakerNotes:
        'Highlight the negative result here—reviewers love honest negative findings. Staleness, low Page-1 CTR, and low scroll depth were all confirmed as decay correlates, whereas raw word count had zero protective effect.',
      renderBody: () => (
        <div className="flex flex-col justify-center h-full space-y-5">
          <div className="overflow-x-auto bg-slate-950/70 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-xs">
                <tr>
                  <th className="py-3 px-4">Hypothesis Tested</th>
                  <th className="py-3 px-4">Observed Subgroup Comparison</th>
                  <th className="py-3 px-4 text-right">Sample (n)</th>
                  <th className="py-3 px-4 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    Staleness (≥180d since update) raises decay
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    61.4% stale vs 44.8% fresh (+16.6 pts)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    30,000
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    CONFIRMED
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    Low CTR (&lt;0.5%) on Page 1 signals decay
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    64.8% low CTR vs 48.2% healthy (+16.6 pts)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    16,970
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    CONFIRMED
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    Low scroll rate (&lt;30%) precedes click loss
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    62.3% low scroll vs 49.1% engaged (+13.2 pts)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    12,030
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                    CONFIRMED
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    Long-form depth (&gt;2,000 words) prevents decay
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    54.0% long vs 55.1% short (-1.1 pts)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    30,000
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400">
                    FALSE
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs sm:text-sm text-slate-300">
            <strong className="text-white">Key Negative Finding:</strong> Contrary to conventional
            SEO folklore, document word count alone offers virtually zero barrier against click
            erosion once facts and search intent drift.
          </div>
        </div>
      ),
    },
    {
      id: 6,
      chapter: '06 · Model Benchmarks',
      title: 'Model Comparison on Held-Out Clients',
      subtitle:
        'A calibrated Random Forest delivers +208% lift in Precision@50 over heuristic rules on identical test splits.',
      timing: '2:45 – 3:20',
      speakerNotes:
        'Present the unified benchmark table. Random Forest beats Logistic Regression, Decision Tree, and the Heuristic Baseline on every ranking metric, hitting 0.740 Precision@50 (37 true positives in top 50).',
      ctaLabel: 'Open Model Benchmarks',
      ctaTab: 'benchmarks',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-center">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-sans">
                <tr>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-3 text-right">ROC AUC</th>
                  <th className="py-3 px-3 text-right">PR AUC</th>
                  <th className="py-3 px-3 text-right text-teal-300">P@50</th>
                  <th className="py-3 px-3 text-right">F1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                <tr className="bg-teal-500/10">
                  <td className="py-3.5 px-4 font-sans font-bold text-white">
                    Random Forest (Selected)
                  </td>
                  <td className="py-3.5 px-3 text-right text-white">0.750</td>
                  <td className="py-3.5 px-3 text-right text-white">0.618</td>
                  <td className="py-3.5 px-3 text-right font-bold text-teal-300">0.740</td>
                  <td className="py-3.5 px-3 text-right text-white">0.640</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-sans text-slate-200">Decision Tree (Depth 5)</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.742</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.575</td>
                  <td className="py-3.5 px-3 text-right text-slate-200">0.540</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.634</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-sans text-slate-200">Logistic Regression</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.700</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.522</td>
                  <td className="py-3.5 px-3 text-right text-slate-200">0.400</td>
                  <td className="py-3.5 px-3 text-right text-slate-300">0.566</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-sans text-slate-400">Baseline Heuristic Rules</td>
                  <td className="py-3.5 px-3 text-right text-slate-400">0.627</td>
                  <td className="py-3.5 px-3 text-right text-slate-400">0.468</td>
                  <td className="py-3.5 px-3 text-right text-rose-400">0.240</td>
                  <td className="py-3.5 px-3 text-right text-slate-500">—</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-sans text-slate-500">Majority-Class Base Rate</td>
                  <td className="py-3 px-3 text-right text-slate-500">0.500</td>
                  <td className="py-3 px-3 text-right text-slate-500">0.542</td>
                  <td className="py-3 px-3 text-right text-slate-500">0.542</td>
                  <td className="py-3 px-3 text-right text-slate-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-center space-y-3">
            <div className="text-xs text-slate-400">Top Random Forest Gini Drivers</div>
            {[
              { name: 'days_with_impressions', val: 0.1578 },
              { name: 'log_impressions_90d', val: 0.1282 },
              { name: 'avg_position', val: 0.109 },
              { name: 'content_age_days', val: 0.0955 },
              { name: 'char_count', val: 0.0426 },
              { name: 'word_count', val: 0.0397 },
            ].map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-mono tabular-nums">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-teal-400 font-bold">{item.val.toFixed(4)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-400 rounded-full"
                    style={{ width: `${(item.val / 0.16) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 7,
      chapter: '07 · Temporal Robustness',
      title: 'The "Sealed Month" Test: June 2026 Shift',
      subtitle:
        'Blind evaluation during a volatile core update month where the positive decline base rate shifted -10.4 points.',
      timing: '3:20 – 3:55',
      speakerNotes:
        'Explain why the sealed June test proves real durability. When Google SERPs shifted and the base rate fell from 54.2% to 43.8%, heuristic rules collapsed to 0.180, while Random Forest retained 91.9% of its precision (0.680).',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl p-6 flex flex-col justify-center space-y-5">
            <div className="text-xs text-slate-400">
              Blind Temporal Holdout · Jan–May Train → June 2026 Sealed Test
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">Random Forest Precision@50</span>
                  <span className="font-mono tabular-nums text-teal-400 font-bold">
                    0.740 → 0.680 (91.9% retention)
                  </span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Decision Tree Precision@50</span>
                  <span className="font-mono tabular-nums text-slate-300">
                    0.540 → 0.440 (81.5% retention)
                  </span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: '44%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-400">Baseline Rules Precision@50</span>
                  <span className="font-mono tabular-nums text-rose-400">
                    0.240 → 0.180 (Collapsed)
                  </span>
                </div>
                <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
              June Shifted Base Rate:{' '}
              <span className="font-mono tabular-nums text-white font-semibold">43.8%</span> (down
              from 54.2% historical)
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-center space-y-4">
            <div className="text-xs text-amber-300 font-semibold">
              Error Analysis Promoted to Policy
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">1. Seasonal False Positives:</strong> High-impression
                pages entering predictable seasonal troughs (e.g., Q4/June shifts) triggered risk
                flags. <em>Policy:</em> Verify seasonality calendar before full rewrite.
              </p>
              <p>
                <strong className="text-white">2. Low-Demand False Negatives:</strong> Pages under
                200 impressions lacked signal density and scored low—preserving reviewer capacity for
                high-impact URLs.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      chapter: '08 · Action Playbook',
      title: 'From Risk Scores to 5 Editorial Playbooks',
      subtitle:
        'Blended scoring, multi-condition confidence gating, and diagnostic reason codes for zero-guesswork review.',
      timing: '3:55 – 4:25',
      speakerNotes:
        'Show how the model becomes actionable for non-technical editors. The blended 0–100 score pairs with discrete reason codes and 5 exact playbooks, while confidence tiers isolate the top 3,605 urgent targets.',
      ctaLabel: 'Open Live Queue Explorer',
      ctaTab: 'queue',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-center">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Suggested Action</th>
                  <th className="py-2.5 px-3 text-right">30k Volume</th>
                  <th className="py-2.5 px-4">Editorial Triage Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                <tr>
                  <td className="py-2.5 px-4 font-mono text-teal-300 font-semibold">
                    refresh_and_review_ctr
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-white">
                    6,657 (22.2%)
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    SERP title, meta description &amp; FAQ schema overhaul
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono text-amber-300 font-semibold">refresh</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-white">
                    8,178 (27.3%)
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    Update outdated facts, citations &amp; timestamp
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono text-indigo-300 font-semibold">
                    refresh_and_review_engagement
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-white">
                    1,990 (6.6%)
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    Above-the-fold summary, TOC &amp; visual layout fix
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono text-cyan-300 font-semibold">
                    expand_and_refresh
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-white">
                    82 (0.3%)
                  </td>
                  <td className="py-2.5 px-4 text-slate-300">
                    Deepen thin articles (&lt;1,200 words) with demand
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-mono text-slate-400 font-semibold">monitor</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                    13,093 (43.6%)
                  </td>
                  <td className="py-2.5 px-4 text-slate-400">
                    Steady state; observe next 30-day cycle
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col justify-center space-y-4">
            <div className="text-xs text-slate-400">
              Blended Score = 100 · (0.70·ModelProb + 0.30·Baseline)
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-700">
              <img
                src="/charts/action_mix.svg"
                alt="Action Mix Distribution"
                className="w-full h-auto max-h-[210px] object-contain"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono tabular-nums pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-bold">3,605</div>
                <div className="text-[10px] text-slate-400 font-sans">High Conf.</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-blue-300 font-bold">11,395</div>
                <div className="text-[10px] text-slate-400 font-sans">Med Conf.</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 font-bold">15,000</div>
                <div className="text-[10px] text-slate-400 font-sans">Suppressed</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      chapter: '09 · Efficiency & Honesty',
      title: 'Operational Impact & Claim Discipline',
      subtitle:
        'Modeled editorial bandwidth savings paired with strict non-causal scientific framing.',
      timing: '4:25 – 4:45',
      speakerNotes:
        'Emphasize the practical value—cutting manual discovery from 2.2 hours down to 0.9 hours per page—while keeping our language rigorously honest: observed, directional, and decision-support only.',
      ctaLabel: 'Open ROI Planner',
      ctaTab: 'roi',
      renderBody: () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-full">
          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-center space-y-5">
            <div className="text-xs text-slate-400">Editorial Triage Efficiency Gain</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400">Manual Discovery</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-rose-400 mt-1">
                  2.2 hrs / page
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Raw GSC spreadsheet sifting</div>
              </div>
              <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
                <div className="text-xs text-teal-300">Prioritized Queue</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-teal-300 mt-1">
                  0.9 hrs / page
                </div>
                <div className="text-[11px] text-teal-200/80 mt-1">
                  Pre-computed reason codes
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-300">
              Saves <strong className="text-white font-mono">1.3 hours per page</strong> (~65
              hours/month on 50-page review sprints) before counting reclaimed organic traffic.
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-center space-y-4">
            <div className="text-xs text-slate-400">The Claim Ladder Audit</div>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30">
                <div className="font-semibold text-emerald-300 mb-1">
                  Allowed · Observed, Directional &amp; Decision-Support
                </div>
                <p className="text-slate-300">
                  &ldquo;The Random Forest ranks forward click-decline risk at 0.740 Precision@50
                  across unseen client portfolios to prioritize editorial inspection.&rdquo;
                </p>
              </div>
              <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/30">
                <div className="font-semibold text-rose-300 mb-1">
                  Banned · Unproven Causal Overreach
                </div>
                <p className="text-slate-300">
                  &ldquo;We predicted Google&apos;s algorithm&rdquo; or &ldquo;Refreshing a page
                  causes a guaranteed +30% traffic rebound.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      chapter: '10 · Summary & Reproducibility',
      title: 'Reproducibility, Warehouse Pipeline & Live Platform',
      subtitle:
        'Complete end-to-end artifacts, 78.8M-row DuckDB workflow, and interactive Three Front Doors application.',
      timing: '4:45 – 5:00',
      speakerNotes:
        'Wrap up with reproducibility and live tools: every assignment notebook from Week 1 to Week 8, the remote DuckDB warehouse query pipeline, fixed seed 42, and our deployed Three Front Doors application. Credit FlyRank.',
      ctaLabel: 'Open Refresh Simulator',
      ctaTab: 'simulator',
      renderBody: (nav) => (
        <div className="flex flex-col justify-between h-full gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => nav('doors')}
              className="text-left p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-teal-400 font-medium">
                <span>Publication System</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-base font-bold text-white">Three Front Doors</div>
              <p className="text-xs text-slate-400">
                Research paper, employer case study, and SEO editorial playbook sharing identical
                evidence.
              </p>
            </button>

            <button
              onClick={() => nav('queue')}
              className="text-left p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-teal-400 font-medium">
                <span>Interactive Triage</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-base font-bold text-white">200-Item Queue Explorer</div>
              <p className="text-xs text-slate-400">
                Filter by action, confidence, and SERP tier with full telemetry inspection drawer.
              </p>
            </button>

            <button
              onClick={() => nav('simulator')}
              className="text-left p-5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 transition-colors space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-teal-400 font-medium">
                <span>Live Scoring Engine</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="text-base font-bold text-white">Opportunity Simulator</div>
              <p className="text-xs text-slate-400">
                Test custom page metrics in real time against calibrated risk and baseline
                formulas.
              </p>
            </button>
          </div>

          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-white">
                Reproducibility &amp; Warehouse Readiness
              </div>
              <div className="text-slate-400">
                Fixed random seed <span className="font-mono text-slate-200">42</span> · Weekly
                notebooks <span className="font-mono text-slate-200">w01–w07 + capstone</span> ·
                Remote DuckDB SQL over{' '}
                <span className="font-mono text-slate-200">FlyRank/internship-warehouse</span>
              </div>
            </div>
            <div className="text-slate-300 shrink-0">
              Built on the FlyRank ML Internship dataset ·{' '}
              <a
                href="https://flyrank.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline font-medium"
              >
                flyrank.ai
              </a>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeSlide = slides[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        setGridView(false);
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  const handleDownloadMarkdown = () => {
    const blob = new Blob([MARKDOWN_EXPORT], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flyrank-capstone-presentation.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`bg-slate-950 text-slate-100 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-6 overflow-y-auto' : 'min-h-[calc(100vh-4rem)]'
      }`}
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col gap-5">
        {/* Presenter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-white text-sm">Capstone Presentation Deck</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Slide {currentIndex + 1} of {slides.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>5-Minute Walkthrough</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setGridView(!gridView)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                gridView
                  ? 'bg-teal-500 text-slate-950 border-teal-500'
                  : 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{gridView ? 'Slide View' : 'All Slides'}</span>
            </button>

            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                showNotes
                  ? 'bg-slate-800 text-teal-300 border-slate-700'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showNotes ? 'Hide Notes' : 'Show Notes'}</span>
            </button>

            <button
              onClick={downloadPresentationPdf}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 border border-teal-500 hover:bg-teal-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Deck (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors shrink-0"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Grid Overview Mode OR Active Slide Stage */}
        {gridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setGridView(false);
                }}
                className={`text-left p-5 rounded-xl border transition-colors flex flex-col justify-between gap-3 ${
                  idx === currentIndex
                    ? 'bg-slate-900 border-teal-500/60'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono tabular-nums">
                    <span>{s.chapter}</span>
                    <span>{s.timing}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{s.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{s.subtitle}</p>
                </div>
                <div className="text-xs font-medium text-teal-400">Jump to slide {idx + 1}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            {/* Active 16:9-proportioned Slide Canvas */}
            <section
              aria-label={`Slide ${activeSlide.id}: ${activeSlide.title}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl flex flex-col justify-between min-h-[480px] lg:min-h-[540px]"
            >
              {/* Slide Header */}
              <div className="space-y-2 pb-6 border-b border-slate-800/80">
                <div className="flex items-center justify-between gap-4 text-xs text-slate-400 font-mono tabular-nums">
                  <span className="text-teal-400 font-semibold">{activeSlide.chapter}</span>
                  <span>Walkthrough {activeSlide.timing}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
                  {activeSlide.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-3xl">
                  {activeSlide.subtitle}
                </p>
              </div>

              {/* Slide Body */}
              <div className="flex-1 py-6">{activeSlide.renderBody(onNavigateTab)}</div>

              {/* Slide Footer Controls */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-950 text-slate-200 border border-slate-800 hover:border-slate-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIndex === slides.length - 1}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 disabled:opacity-40 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Stepper */}
                <div className="hidden md:flex items-center gap-1.5">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? 'w-7 bg-teal-400'
                          : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                {activeSlide.ctaLabel && activeSlide.ctaTab ? (
                  <button
                    onClick={() => onNavigateTab(activeSlide.ctaTab!)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 text-teal-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>{activeSlide.ctaLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 font-mono">
                    Use ← / → arrow keys to navigate
                  </span>
                )}
              </div>
            </section>

            {/* Collapsible Speaker Notes Panel */}
            {showNotes && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-medium">
                    Speaker Notes · {activeSlide.timing}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
                    {activeSlide.speakerNotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
