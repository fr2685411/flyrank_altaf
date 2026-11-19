import { jsPDF } from 'jspdf';

interface SlidePdfContent {
  number: number;
  chapter: string;
  title: string;
  subtitle: string;
  timing: string;
  highlights?: { label: string; value: string; note?: string; accent?: 'teal' | 'rose' | 'amber' | 'white' }[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
    colWidths: number[];
    highlightRow?: number;
  };
  formula?: string;
  callout?: { title: string; text: string };
  speakerNotes: string;
}

const SLIDES: SlidePdfContent[] = [
  {
    number: 1,
    chapter: '01 · THESIS & HEADLINE RESULT',
    title: 'An Early-Warning Queue for Organic Click Decline',
    subtitle: 'Client-grouped and time-forward evaluation of a decision-support ranker across 30,000 anonymized search assets.',
    timing: '0:00 – 0:30',
    highlights: [
      { label: 'Primary Metric · Precision@50', value: '0.740', note: '+208% lift vs 0.240 rule baseline', accent: 'teal' },
      { label: 'ROC AUC (Unseen Clients)', value: '0.750', note: '32 clients · Grouped holdout', accent: 'white' },
      { label: 'June Sealed Month P@50', value: '0.680', note: '91.9% retention under core shift', accent: 'teal' },
    ],
    bullets: [
      'Operational Question: Out of thousands of aging articles, which 50 should an editorial team refresh FIRST to prevent avoidable organic click loss?',
      'Validation Standard: Strict grouped client holdout (no shared domains across splits) plus blind temporal evaluation on June 2026.',
      'Public-Safe Design: Zero URLs, titles, client names, or raw search keywords exposed to the model.',
    ],
    callout: {
      title: 'Portfolio & Warehouse Scale',
      text: '30,000 starter pages (54.2% base decline rate) paired with a zero-download DuckDB SQL pipeline over the 78.8M-row FlyRank/internship-warehouse release.',
    },
    speakerNotes: 'Open with the operational triage question. Emphasize that we do not claim to predict Google’s algorithm—we prioritize weekly editorial capacity.',
  },
  {
    number: 2,
    chapter: '02 · PROBLEM FRAMING',
    title: 'The Operational Triage Dilemma',
    subtitle: 'Why content refresh prioritization is a capacity-bounded ranking problem rather than binary classification.',
    timing: '0:30 – 1:00',
    highlights: [
      { label: 'Weekly Review Capacity', value: '50 URLs', note: 'Bounded editorial sprint bandwidth', accent: 'teal' },
      { label: 'False Positive Cost', value: '1.5–2.0 hrs', note: '$45–$70/hr wasted on stable pages', accent: 'amber' },
      { label: 'Empirical Base Rate', value: '54.2%', note: '16,262 declining items / 30,000 total', accent: 'white' },
    ],
    bullets: [
      'Why Binary Thresholds Fail: Hard cutoffs either flood editors with 8,000 unranked alerts or starve weekly capacity during quiet seasonal periods.',
      'False Negative Cost: Failing to flag decaying high-demand assets risks slipping from Page 1 (#3) to Page 2 (#14), forfeiting high-intent clicks.',
      'Temporal Alignment: Strictly separated 90-day trailing feature window [T-90, T0] predicting forward 30-day click drops >= 15% [T0, T+30].',
    ],
    callout: {
      title: 'Target Definition (Observed Outcome)',
      text: 'is_declining_label = 1 when forward 30-day organic clicks decline by >= 15% relative to the prior 30-day window.',
    },
    speakerNotes: 'Explain why Precision@50 matches real editorial sprints far better than global Accuracy or ROC AUC alone.',
  },
  {
    number: 3,
    chapter: '03 · HEURISTIC BASELINE',
    title: 'Why Fixed Rules Fail: The "Giant Evergreen" Trap',
    subtitle: 'A transparent 4-signal baseline sets the honest benchmark floor—and exposes why static SEO rules misfire.',
    timing: '1:00 – 1:30',
    formula: 'Baseline Score = 0.40 · Visibility + 0.30 · Freshness + 0.25 · Position + 0.05 · DepthGap',
    highlights: [
      { label: 'Baseline Precision@50', value: '0.240', note: 'Only 12 / 50 hits (below 54.2% base rate)', accent: 'rose' },
      { label: 'Baseline ROC AUC', value: '0.627', note: 'Modest global ranking separation', accent: 'white' },
      { label: 'Baseline PR AUC', value: '0.468', note: 'Underperforms class balance', accent: 'white' },
    ],
    bullets: [
      'Visibility (40%): PercentileRank(log(1 + impressions_90d)) measures total search demand.',
      'Freshness (30%): PercentileRank(days_since_last_update) penalizes older update timestamps.',
      'Top-20 Hand Review Finding: Volume and calendar age dominate the linear score, repeatedly flagging massive, healthy evergreen guides while burying early decay on mid-volume pages below rank #500.',
    ],
    speakerNotes: 'Walk through the top-20 hand review finding: static heuristics waste reviewer hours on large stable guides.',
  },
  {
    number: 4,
    chapter: '04 · DATA CONTRACT & LEAKAGE',
    title: 'Attacking Our Own Model: The Confession Test',
    subtitle: 'Strict 44-column field governance, target-leakage quarantine, and grouped client-holdout validation.',
    timing: '1:30 – 2:15',
    table: {
      headers: ['Experiment / Split Protocol', 'ROC AUC', 'Precision@50', 'Diagnostic Finding'],
      colWidths: [82, 32, 36, 115],
      highlightRow: 1,
      rows: [
        ['Leaky Run: Includes trend_direction', '0.992', '1.000', 'Direct outcome-window leakage (Quarantined)'],
        ['Honest Run: Quarantine Enforced', '0.750', '0.740', '24.2-pt AUC drop proves clean feature boundary'],
        ['Naive Random 80/20 Row Split', '0.842', '0.820', 'Memorizes client domain authority across splits'],
        ['Grouped Client Holdout (8 unseen)', '0.750', '0.740', '9.2-pt gap exposes true out-of-domain skill'],
      ],
    },
    bullets: [
      '44-Column Contract: 34 safe trailing-90d features, 1 target, 2 context IDs (content_id, client_id), and 7 banned columns (trend_direction, trend_pct, health_score).',
      'Gotchas Handled: avg_position = 0 (1,205 rows) flagged as missing rank data; rate columns interpreted as x100 percentages.',
    ],
    speakerNotes: 'Show the Confession Test and the 9.2-point memorization gap between random splitting and grouped client holdout.',
  },
  {
    number: 5,
    chapter: '05 · SIGNAL AUDIT',
    title: 'Signal Audit Verdicts Across 30,000 Pages',
    subtitle: 'Hypothesis testing with sample-size floors (n >= 50) and log1p volume handling.',
    timing: '2:15 – 2:45',
    table: {
      headers: ['Hypothesis Tested', 'Observed Subgroup Comparison', 'Sample (n)', 'Verdict'],
      colWidths: [84, 110, 35, 36],
      rows: [
        ['Staleness (>=180d since update) raises decay', '61.4% stale vs 44.8% fresh (+16.6 pts)', '30,000', 'CONFIRMED'],
        ['Low CTR (<0.5%) on Page 1 signals decay', '64.8% low CTR vs 48.2% healthy (+16.6 pts)', '16,970', 'CONFIRMED'],
        ['Low scroll rate (<30%) precedes click loss', '62.3% low scroll vs 49.1% engaged (+13.2 pts)', '12,030', 'CONFIRMED'],
        ['Long content (>2,000 words) prevents decay', '54.0% long vs 55.1% short (-1.1 pts)', '30,000', 'FALSE'],
      ],
    },
    callout: {
      title: 'Published Negative Result',
      text: 'Contrary to common SEO folklore, article word count alone offers virtually zero structural protection against organic click decay once facts or search intent go stale.',
    },
    speakerNotes: 'Highlight both the three confirmed signals and the negative result on word count.',
  },
  {
    number: 6,
    chapter: '06 · MODEL BENCHMARKS',
    title: 'Model Comparison on Held-Out Clients',
    subtitle: 'A calibrated Random Forest delivers +208% lift in Precision@50 over heuristic rules on identical test splits.',
    timing: '2:45 – 3:20',
    table: {
      headers: ['Candidate Model', 'ROC AUC', 'PR AUC', 'Precision@50', 'Recall', 'F1 Score'],
      colWidths: [85, 35, 35, 42, 34, 34],
      highlightRow: 0,
      rows: [
        ['Random Forest (Selected Best)', '0.750', '0.618', '0.740', '0.744', '0.640'],
        ['Decision Tree (Max Depth = 5)', '0.742', '0.575', '0.540', '0.716', '0.634'],
        ['Logistic Regression (L2)', '0.700', '0.522', '0.400', '0.567', '0.566'],
        ['Baseline Heuristic Rules', '0.627', '0.468', '0.240', '-', '-'],
        ['Majority-Class Random Floor', '0.500', '0.542', '0.542', '1.000', '0.703'],
      ],
    },
    bullets: [
      'Top Gini Drivers: days_with_impressions (0.1578), log_impressions_90d (0.1282), avg_position (0.1090), content_age_days (0.0955), char_count (0.0426).',
      '37 of the top 50 prioritized pages truly suffered forward 30-day click loss, compared to just 12 under heuristic rules.',
    ],
    speakerNotes: 'Walk down the table from Logistic Regression to Decision Tree to Random Forest. Point out that top Gini drivers align with search demand consistency.',
  },
  {
    number: 7,
    chapter: '07 · TEMPORAL ROBUSTNESS',
    title: 'The "Sealed Month" Test: June 2026 Shift',
    subtitle: 'Blind evaluation during a core SERP volatility month where the decline base rate dropped from 54.2% to 43.8%.',
    timing: '3:20 – 3:55',
    highlights: [
      { label: 'Random Forest Sealed P@50', value: '0.680', note: '91.9% retention (+55% over June base rate)', accent: 'teal' },
      { label: 'Decision Tree Sealed P@50', value: '0.440', note: '81.5% retention (significant drift)', accent: 'amber' },
      { label: 'Baseline Rules Sealed P@50', value: '0.180', note: 'Collapsed under algorithm volatility', accent: 'rose' },
    ],
    bullets: [
      'Error Analysis Case 1 (Seasonal False Positives): Pages entering predictable seasonal dips triggered high risk -> Promoted to editorial policy: check client seasonality calendar before full rewrite.',
      'Error Analysis Case 2 (Low-Demand False Negatives): Low-impression pages (<200 imp) scored low -> Acceptable triage behavior that preserves reviewer hours for high-impact pages.',
    ],
    speakerNotes: 'Demonstrate temporal resilience: when June 2026 shifted the base rate by 10.4 points, heuristic rules collapsed while Random Forest held 91.9% of its precision.',
  },
  {
    number: 8,
    chapter: '08 · ACTION PLAYBOOK',
    title: 'From Risk Scores to 5 Editorial Playbooks',
    subtitle: 'Blended scoring, multi-condition confidence gating, and diagnostic reason codes for zero-guesswork review.',
    timing: '3:55 – 4:25',
    formula: 'Final Refresh Score = 100 · (0.70 · ModelProbability + 0.30 · NormalizedBaseline) in [0, 100]',
    table: {
      headers: ['Suggested Action', '30k Volume', 'Trigger Criteria & Editorial Triage Protocol'],
      colWidths: [68, 42, 155],
      rows: [
        ['refresh_and_review_ctr', '6,657 (22.2%)', 'Pos <= 20, imp >= 500, CTR < 0.5% -> Overhaul SERP title, meta & FAQ schema'],
        ['refresh', '8,178 (27.3%)', 'Proven demand + staleness/decay -> Update facts, citations & timestamp'],
        ['refresh_and_review_engagement', '1,990 (6.6%)', 'Sessions >= 30, scroll/eng < 30% -> Add above-the-fold TOC & visual layout fix'],
        ['expand_and_refresh', '82 (0.3%)', 'Thin (<1,200 words) with impressions -> Deepen topical coverage & examples'],
        ['monitor', '13,093 (43.6%)', 'Steady traffic or low demand -> Observe next 30-day cycle without budget spend'],
      ],
    },
    bullets: [
      'Confidence Filtering: Isolates 3,605 High-Confidence items (12.0%) for top-50 weekly sprints; suppresses 15,000 low-confidence rows to prevent reviewer fatigue.',
    ],
    speakerNotes: 'Explain how the blended score and reason codes translate model probabilities into concrete Monday-morning tasks for editors.',
  },
  {
    number: 9,
    chapter: '09 · EFFICIENCY & HONESTY',
    title: 'Operational Impact & Claim Discipline',
    subtitle: 'Modeled editorial bandwidth savings paired with strict non-causal scientific framing.',
    timing: '4:25 – 4:45',
    highlights: [
      { label: 'Manual Audit Discovery', value: '2.2 hrs/pg', note: 'Sifting raw GSC & GA4 exports', accent: 'rose' },
      { label: 'FlyRank Prioritized Queue', value: '0.9 hrs/pg', note: 'Pre-computed reason codes & checklists', accent: 'teal' },
      { label: 'Direct Time Saved', value: '1.3 hrs/pg', note: '~65 editorial hrs/mo on 50-page sprints', accent: 'teal' },
    ],
    bullets: [
      'Allowed Claim Language: "Observed", "measured", "associated with", and "decision-support priority queue."',
      'Strictly Banned Claims: Never state "we predicted Google’s algorithm" or claim guaranteed "+X% causal traffic rebound" without a controlled A/B experiment.',
    ],
    callout: {
      title: 'Practical Deployment Policy',
      text: 'Use the ranked queue as a human reviewer aid—verify seasonality and editorial context before publishing updates, never as an autonomous publishing trigger.',
    },
    speakerNotes: 'State the audit time savings clearly while reinforcing FlyRank’s honest non-causal claim discipline.',
  },
  {
    number: 10,
    chapter: '10 · REPRODUCIBILITY & PLATFORM',
    title: 'Reproducibility, Warehouse Pipeline & Live Platform',
    subtitle: 'Complete weekly deliverables, 78.8M-row DuckDB workflow, and interactive Three Front Doors application.',
    timing: '4:45 – 5:00',
    bullets: [
      'Interactive Web App: Deployed React + TypeScript platform with Three Front Doors reader, 200-item Live Queue Explorer, Real-Time Simulator, Model Benchmarks, Data Contract, and ROI Planner.',
      '78.8M-Row Warehouse Integration: Remote DuckDB SQL aggregations over Hugging Face Parquet partitions (guarding against GA4 zero-fills with ga4_data_available = TRUE and ANY_VALUE on context columns).',
      'Complete Weekly Artifacts: Notebooks w01 through w07 + capstone.ipynb, fixed seed=42, and submission pointer in submission/paper_url.txt.',
    ],
    callout: {
      title: 'Acknowledgments & Data Credit',
      text: 'Built on the FlyRank ML Internship dataset (https://flyrank.ai). Thank you!',
    },
    speakerNotes: 'Close by walking through reproducibility, the DuckDB warehouse architecture, and the FlyRank data credit.',
  },
];

export function buildPresentationPdf(): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 167],
  });

  const W = 297;
  const H = 167;
  const M = 16;
  const CW = W - M * 2; // 265mm

  SLIDES.forEach((slide, idx) => {
    if (idx > 0) {
      doc.addPage([297, 167], 'landscape');
    }

    // Background canvas (#0b1020)
    doc.setFillColor(11, 16, 32);
    doc.rect(0, 0, W, H, 'F');

    // Subtle top accent bar (#14b8a6 teal)
    doc.setFillColor(20, 184, 166);
    doc.rect(0, 0, W, 1.4, 'F');

    // Chapter kicker & timing
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(94, 234, 212); // teal-300
    doc.text(slide.chapter, M, 12);

    doc.setFont('courier', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Walkthrough ${slide.timing}`, W - M, 12, { align: 'right' });

    // Slide Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(248, 250, 252);
    doc.text(slide.title, M, 21);

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    const subLines = doc.splitTextToSize(slide.subtitle, CW);
    doc.text(subLines, M, 28);

    const headerBottom = 28 + subLines.length * 4.5 + 2;
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.4);
    doc.line(M, headerBottom, W - M, headerBottom);

    let y = headerBottom + 6;

    // Optional formula bar
    if (slide.formula) {
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(M, y, CW, 10, 1.5, 1.5, 'FD');
      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(94, 234, 212);
      doc.text(slide.formula, M + 4, y + 6.4);
      y += 14;
    }

    // Optional highlights row (3 cards across)
    if (slide.highlights && slide.highlights.length > 0) {
      const gap = 5;
      const cardW = (CW - gap * (slide.highlights.length - 1)) / slide.highlights.length;
      const cardH = 26;

      slide.highlights.forEach((h, hIdx) => {
        const cx = M + hIdx * (cardW + gap);
        doc.setFillColor(15, 23, 42);
        doc.setDrawColor(30, 41, 59);
        doc.roundedRect(cx, y, cardW, cardH, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(h.label, cx + 4, y + 6.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(17);
        if (h.accent === 'teal') doc.setTextColor(94, 234, 212);
        else if (h.accent === 'rose') doc.setTextColor(251, 113, 133);
        else if (h.accent === 'amber') doc.setTextColor(252, 211, 77);
        else doc.setTextColor(248, 250, 252);
        doc.text(h.value, cx + 4, y + 15.5);

        if (h.note) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          const noteLines = doc.splitTextToSize(h.note, cardW - 8);
          doc.text(noteLines[0], cx + 4, y + 22);
        }
      });

      y += cardH + 6;
    }

    // Optional table
    if (slide.table) {
      const { headers, rows, colWidths, highlightRow } = slide.table;
      const rowH = 8.2;

      // Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(M, y, CW, rowH, 'F');
      doc.setDrawColor(51, 65, 85);
      doc.line(M, y + rowH, M + CW, y + rowH);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      let tx = M + 3;
      headers.forEach((hdr, cIdx) => {
        doc.text(hdr, tx, y + 5.5);
        tx += colWidths[cIdx];
      });
      y += rowH;

      // Table Rows
      rows.forEach((row, rIdx) => {
        const isHl = highlightRow === rIdx;
        if (isHl) {
          doc.setFillColor(13, 56, 54);
          doc.rect(M, y, CW, rowH, 'F');
        } else if (rIdx % 2 === 1) {
          doc.setFillColor(15, 23, 42);
          doc.rect(M, y, CW, rowH, 'F');
        }

        doc.setDrawColor(30, 41, 59);
        doc.line(M, y + rowH, M + CW, y + rowH);

        let rx = M + 3;
        row.forEach((cell, cIdx) => {
          doc.setFont(cIdx === 0 ? 'helvetica' : 'courier', isHl ? 'bold' : 'normal');
          doc.setFontSize(8);
          if (cell === 'CONFIRMED') doc.setTextColor(52, 211, 153);
          else if (cell === 'FALSE') doc.setTextColor(251, 113, 133);
          else if (isHl) doc.setTextColor(94, 234, 212);
          else doc.setTextColor(226, 232, 240);

          const maxChars = Math.floor(colWidths[cIdx] / 1.9);
          const trimmed = cell.length > maxChars ? cell.slice(0, maxChars - 1) + '…' : cell;
          doc.text(trimmed, rx, y + 5.4);
          rx += colWidths[cIdx];
        });
        y += rowH;
      });

      y += 5;
    }

    // Optional bullets
    if (slide.bullets && slide.bullets.length > 0) {
      slide.bullets.forEach((b) => {
        doc.setFillColor(94, 234, 212);
        doc.circle(M + 2, y + 2.3, 0.9, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(226, 232, 240);
        const lines = doc.splitTextToSize(b, CW - 8);
        doc.text(lines, M + 6, y + 3.5);
        y += lines.length * 4.6 + 2.5;
      });
    }

    // Optional callout box at bottom of body
    if (slide.callout && y < 134) {
      const boxY = Math.max(y + 1, 122);
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(20, 184, 166);
      doc.roundedRect(M, boxY, CW, 19, 1.8, 1.8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(94, 234, 212);
      doc.text(slide.callout.title, M + 4, boxY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(203, 213, 225);
      const calloutLines = doc.splitTextToSize(slide.callout.text, CW - 8);
      doc.text(calloutLines, M + 4, boxY + 11.5);
    }

    // Footer bar
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.3);
    doc.line(M, H - 14, W - M, H - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'FlyRank Applied Search Intelligence · Refresh Opportunity Scoring Capstone · flyrank.ai',
      M,
      H - 8
    );

    doc.setFont('courier', 'bold');
    doc.text(`Slide ${slide.number} / ${SLIDES.length}`, W - M, H - 8, { align: 'right' });
  });

  return doc;
}

export function downloadPresentationPdf(): void {
  const doc = buildPresentationPdf();
  doc.save('flyrank-capstone-presentation.pdf');
}
