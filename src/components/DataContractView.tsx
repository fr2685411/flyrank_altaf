import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  FileCode,
  Lock,
  CheckCircle2,
  Database,
  Layers,
} from 'lucide-react';

export const DataContractView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contract' | 'leakage' | 'dictionary'>('contract');

  const contractRules = [
    {
      rule: 'Rule 1: Client-Holdout Validation',
      status: 'Enforced',
      desc: 'Random row splits are forbidden. Models are validated on entire unseen client domains to prevent memorizing client-specific baseline traffic.',
    },
    {
      rule: 'Rule 2: Zero Target Leakage',
      status: 'Enforced',
      desc: 'Post-prediction horizon metrics (e.g. clicks in evaluation month) are strictly prohibited from the feature vector.',
    },
    {
      rule: 'Rule 3: PII & Identity Redaction',
      status: 'Enforced',
      desc: 'No URLs, page titles, raw search queries, or client brand names are accessible to the ML model. Only structural, behavioral, and telemetry signals are consumed.',
    },
    {
      rule: 'Rule 4: Monotonic Integrity',
      status: 'Enforced',
      desc: 'Mathematical constraints verified before ingestion: impressions_90d >= clicks_90d >= 0; days_with_impressions <= 90.',
    },
    {
      rule: 'Rule 5: Actionable Outcome Contract',
      status: 'Enforced',
      desc: 'Predictions are never bare scores; every scored page must output an actionable decision code (e.g. refresh_and_review_ctr) with editorial next steps.',
    },
  ];

  const signalsSample = [
    { name: 'impressions_90d', type: 'Numeric', desc: 'Google Search Console impressions in preceding 90-day window' },
    { name: 'clicks_90d', type: 'Numeric', desc: 'Google Search Console clicks in preceding 90-day window' },
    { name: 'avg_position', type: 'Numeric', desc: 'Mean organic SERP ranking position (#1 to #50)' },
    { name: 'ctr', type: 'Numeric', desc: 'Observed click-through rate (clicks / impressions)' },
    { name: 'content_age_days', type: 'Numeric', desc: 'Days elapsed since first indexed publication' },
    { name: 'days_since_last_update', type: 'Numeric', desc: 'Days elapsed since last registered CMS modification' },
    { name: 'word_count', type: 'Numeric', desc: 'Document body word count' },
    { name: 'char_count', type: 'Numeric', desc: 'Document body character count' },
    { name: 'sessions_90d', type: 'Numeric', desc: 'Google Analytics 4 total sessions' },
    { name: 'engaged_sessions_90d', type: 'Numeric', desc: 'Sessions with >10s duration or key events' },
    { name: 'scroll_rate', type: 'Numeric', desc: 'Percentage of sessions reaching 90% scroll depth' },
    { name: 'trend_direction', type: 'Categorical', desc: 'Recent 30d vs prior 30d trajectory: down, flat, up' },
    { name: 'competition_level', type: 'Categorical', desc: 'Keyword competition bucket: LOW, MEDIUM, HIGH' },
    { name: 'main_intent', type: 'Categorical', desc: 'informational, commercial, navigational, transactional' },
    { name: 'is_declining_label', type: 'Target (Boolean)', desc: '1 if organic clicks declined >= 15% in forward evaluation month' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
            PRODUCTION INTEGRITY
          </span>
          <span className="text-xs text-slate-400">Strict Data Contract &amp; Leakage Audit</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Data Contract &amp; Leakage Defenses
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          How FlyRank prevents target leakage, client overfitting, and data contamination across
          30,000 scored assets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('contract')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'contract'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Data Contract Rules
        </button>
        <button
          onClick={() => setActiveTab('leakage')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'leakage'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Leakage Audit
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'dictionary'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Signals &amp; Schema
        </button>
      </div>

      {/* Tab: Contract Rules */}
      {activeTab === 'contract' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contractRules.map((c, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {c.rule}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Leakage Audit */}
      {activeTab === 'leakage' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-400" />
            <div>
              <h2 className="text-base font-bold text-white">
                Forbidden Features &amp; Redaction Policy
              </h2>
              <p className="text-xs text-slate-400">
                Signals intentionally excluded from model input to prevent superficial memorization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-rose-400">URL &amp; Domain Paths</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw URLs leak brand hierarchy, slug structures, and client identity, causing models
                to overfit to specific domains instead of learning generalizable decay dynamics.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-rose-400">Target Keywords &amp; Titles</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specific keyword search terms fluctuate rapidly. Including them causes the model
                to latch onto ephemeral search trends rather than behavioral engagement and decay.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-rose-400">Future-Window Metrics</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                All evaluation metrics are calculated strictly on the future 30-day horizon and
                never pass backward into the 90-day feature construction vector.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Signals Schema */}
      {activeTab === 'dictionary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-400" />
              Core Feature Signals Dictionary (Subset of 44 Fields)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Feature Name</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Description &amp; Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {signalsSample.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-teal-300">{s.name}</td>
                    <td className="py-2.5 px-4 text-slate-400">{s.type}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-300">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
