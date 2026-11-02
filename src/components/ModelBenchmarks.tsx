import React, { useState } from 'react';
import { ModelMetricRow } from '../types';
import {
  BarChart3,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Zap,
} from 'lucide-react';

export const ModelBenchmarks: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'features' | 'actions' | 'confidence' | 'reasons' | 'trends'>('features');

  const models: ModelMetricRow[] = [
    {
      model: 'Random Forest (Selected)',
      roc_auc: 0.750,
      avg_precision: 0.618,
      precision_at_50: 0.740,
      recall: 0.744,
      f1: 0.640,
      isBest: true,
    },
    {
      model: 'Decision Tree',
      roc_auc: 0.742,
      avg_precision: 0.575,
      precision_at_50: 0.540,
      recall: 0.716,
      f1: 0.634,
      isBest: false,
    },
    {
      model: 'Logistic Regression',
      roc_auc: 0.700,
      avg_precision: 0.522,
      precision_at_50: 0.400,
      recall: 0.567,
      f1: 0.566,
      isBest: false,
    },
    {
      model: 'Baseline Heuristic Rules',
      roc_auc: 0.627,
      avg_precision: 0.468,
      precision_at_50: 0.240,
      recall: '—',
      f1: '—',
      isBest: false,
    },
  ];

  const topFeatures = [
    { feature: 'days_with_impressions', importance: 0.1578, desc: 'Search consistency over 90 days' },
    { feature: 'log_impressions_90d', importance: 0.1282, desc: 'Total aggregate Google Search demand' },
    { feature: 'avg_position', importance: 0.1090, desc: 'SERP ranking position (#1 to #50)' },
    { feature: 'content_age_days', importance: 0.0955, desc: 'Elapsed time since first indexing' },
    { feature: 'char_count', importance: 0.0426, desc: 'Textual length in characters' },
    { feature: 'word_count', importance: 0.0397, desc: 'Total document word count' },
    { feature: 'log_clicks_90d', importance: 0.0346, desc: 'Historical click volume baseline' },
    { feature: 'ctr', importance: 0.0330, desc: 'Clicks per 100 impressions' },
    { feature: 'scroll_rate', importance: 0.0311, desc: 'Reader vertical completion rate' },
    { feature: 'days_with_sessions', importance: 0.0280, desc: 'Active traffic day frequency' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
            EVALUATION &amp; EMPIRICAL EVIDENCE
          </span>
          <span className="text-xs text-slate-400">Client-Holdout Validation Scheme</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Model Benchmarks &amp; Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Comparing machine-learned rankers against industry-standard rule baselines.
          Optimized for Precision@50 to fit real editorial review capacity.
        </p>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Award className="w-16 h-16 text-teal-400" />
          </div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Precision@50 (Top Priority Queue)
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-teal-400 font-mono">0.740</span>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              +208% vs Baseline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            37 of the top 50 prioritized pages truly suffered severe click decline, vs only 12 in the baseline.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            ROC AUC (Discrimination)
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white font-mono">0.750</span>
            <span className="text-xs text-slate-400">vs 0.627 Baseline</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Maintains robust ranking separation across diverse client niches without client-name leakage.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Average Precision (PR AUC)
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-white font-mono">0.618</span>
            <span className="text-xs text-slate-400">vs 0.468 Baseline</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Evaluates whole-queue precision under imbalanced real-world ranking conditions.
          </p>
        </div>
      </div>

      {/* Model Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-400" />
            Model Benchmark Performance Matrix
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Split Strategy: client_holdout (n=30,000)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Candidate Model</th>
                <th className="py-3 px-4">ROC AUC</th>
                <th className="py-3 px-4">Avg Precision</th>
                <th className="py-3 px-4 bg-teal-500/10 text-teal-300">Precision@50</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1 Score</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {models.map((m, i) => (
                <tr
                  key={i}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    m.isBest ? 'bg-teal-500/5' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    {m.isBest && <span className="w-2 h-2 rounded-full bg-teal-400" />}
                    <span>{m.model}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{m.roc_auc.toFixed(3)}</td>
                  <td className="py-3.5 px-4 text-slate-300">{m.avg_precision.toFixed(3)}</td>
                  <td className="py-3.5 px-4 font-bold text-teal-300 bg-teal-500/10">
                    {m.precision_at_50.toFixed(3)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{m.recall}</td>
                  <td className="py-3.5 px-4 text-slate-400">{m.f1}</td>
                  <td className="py-3.5 px-4 text-right">
                    {m.isBest ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        PRODUCTION BEST
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans text-slate-500">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Why Precision@50 as the selection metric?</strong>{' '}
            Human editorial time is strictly bounded: editorial teams cannot review 10,000 pages
            at once; they review batches of ~50 pages per week. Maximizing Precision@50 ensures
            that when editors sit down to refresh pages, their first 50 targets have the highest
            density of genuine declining assets.
          </div>
        </div>
      </div>

      {/* Feature Importance & Pipeline Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feature Importance (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              Top Random Forest Feature Weights
            </h2>
            <span className="text-xs text-slate-500 font-mono">Gini Importance</span>
          </div>

          <div className="space-y-2.5">
            {topFeatures.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-mono font-medium text-slate-300">{f.feature}</span>
                  <span className="font-mono text-teal-400 font-bold">{f.importance.toFixed(4)}</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                    style={{ width: `${(f.importance / 0.16) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Gallery Viewer (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Pipeline Artifact Charts
            </h2>
          </div>

          {/* Chart selector tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveChart('features')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                activeChart === 'features'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Top Features
            </button>
            <button
              onClick={() => setActiveChart('actions')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                activeChart === 'actions'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Action Mix
            </button>
            <button
              onClick={() => setActiveChart('reasons')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                activeChart === 'reasons'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Reason Codes
            </button>
            <button
              onClick={() => setActiveChart('confidence')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                activeChart === 'confidence'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Confidence Mix
            </button>
            <button
              onClick={() => setActiveChart('trends')}
              className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                activeChart === 'trends'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Trend Mix
            </button>
          </div>

          {/* Chart Display Area */}
          <div className="flex-1 bg-white rounded-lg p-3 min-h-[300px] flex items-center justify-center border border-slate-700 overflow-hidden">
            {activeChart === 'features' && (
              <img
                src="/charts/top_feature_importance.svg"
                alt="Top Model Features"
                className="max-h-[320px] w-auto object-contain"
              />
            )}
            {activeChart === 'actions' && (
              <img
                src="/charts/action_mix.svg"
                alt="Suggested Action Mix"
                className="max-h-[320px] w-auto object-contain"
              />
            )}
            {activeChart === 'reasons' && (
              <img
                src="/charts/top_reason_codes.svg"
                alt="Top Reason Codes"
                className="max-h-[320px] w-auto object-contain"
              />
            )}
            {activeChart === 'confidence' && (
              <img
                src="/charts/confidence_mix.svg"
                alt="Confidence Mix"
                className="max-h-[320px] w-auto object-contain"
              />
            )}
            {activeChart === 'trends' && (
              <img
                src="/charts/trend_distribution.svg"
                alt="Trend Distribution"
                className="max-h-[320px] w-auto object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* The Sealed Month Experiment (Temporal Shift) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">
            The &quot;Sealed Month&quot; Temporal Audit (June Algorithm Update)
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In organic search, models must withstand Google search algorithm updates and seasonal
          macro-shifts. To verify temporal durability, the model trained on pre-June data was
          evaluated blindly against the June 2026 sealed test month. Even when the overall
          positive label base rate shifted from 54.2% down to 43.8%, the Random Forest ranker
          maintained <strong>0.680 Precision@50</strong>, proving it prioritizes pages based on
          intrinsic decay dynamics rather than time-bound artifacts.
        </p>
      </div>
    </div>
  );
};
