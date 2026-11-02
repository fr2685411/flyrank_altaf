import React from 'react';
import { ScoredPage } from '../types';
import {
  X,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Clock,
  FileText,
  Search,
  Eye,
  BarChart2,
} from 'lucide-react';

interface PageDrawerProps {
  page: ScoredPage | null;
  onClose: () => void;
  onSimulate: (page: ScoredPage) => void;
}

export const PageDrawer: React.FC<PageDrawerProps> = ({ page, onClose, onSimulate }) => {
  if (!page) return null;

  const score = Number(page.final_refresh_score);
  const modelProb = Number(page.best_model_probability);
  const baselineScore = Number(page.baseline_refresh_score);
  const reasons = (page.final_reason_codes || '').split('|').filter(Boolean);

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'refresh_and_review_ctr':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
      case 'refresh_and_review_engagement':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'expand_and_refresh':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'refresh':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'medium':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-700';
    }
  };

  const getReasonExplanation = (reason: string) => {
    switch (reason) {
      case 'declining_with_demand':
        return 'Clicks & impressions declining while user search volume remains strong.';
      case 'low_ctr_visible_page':
        return 'High impressions on Page 1/2 with CTR < 0.5%. SERP snippet hook is losing clicks.';
      case 'low_engagement_visible_page':
        return 'Traffic bounce risk: sessions ≥30 but low scroll or interaction rate.';
      case 'stale_visible_page':
        return 'Content unmodified for 180+ days despite ongoing search presence.';
      case 'thin_visible_page':
        return 'Under 1,200 words receiving organic impressions. Prime expansion candidate.';
      case 'page_one_decay_risk':
        return 'Currently on Page 1 (pos ≤10) and aged ≥180d. High value asset at risk of slip.';
      case 'model_decline_risk':
        return 'Random Forest classifier assigns high probability (≥65%) to imminent organic decline.';
      case 'visible_model_opportunity':
        return 'High decline risk combined with strong demand (≥500 impressions).';
      case 'ctr_review_candidate':
        return 'Priority target for title tag and meta description overhaul.';
      case 'engagement_review_candidate':
        return 'Priority target for intro readability and visual asset enrichment.';
      default:
        return 'Flagged for standard scheduled content refresh review.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-teal-400 border border-slate-700">
                Rank #{page.final_rank}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${getConfidenceBadge(
                  page.confidence
                )}`}
              >
                {page.confidence} confidence
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {page.client_id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              {page.content_id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Opportunity Score Highlight */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Final Refresh Score
              </div>
              <div className="text-3xl font-extrabold text-teal-400 tracking-tight font-mono mt-0.5">
                {score.toFixed(1)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                70% Model Probability + 30% Baseline Rules
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Model Probability</div>
              <div className="text-base font-bold text-white font-mono">
                {(modelProb * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Baseline Rule Score</div>
              <div className="text-sm font-semibold text-slate-300 font-mono">
                {(baselineScore * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Action Recommendation */}
          <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Recommended Editorial Action
            </div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border mb-3 ${getActionBadgeColor(
                page.suggested_action
              )}`}
            >
              {page.suggested_action.replace(/_/g, ' ')}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {page.suggested_action === 'refresh_and_review_ctr' &&
                'High Google search visibility with lagging click-through rate. Prioritize SERP snippet, title hook, and search intent alignment before rewriting entire page.'}
              {page.suggested_action === 'refresh_and_review_engagement' &&
                'Healthy impressions, but bounce rate is high. Focus on readability above the fold, subheadings, and interactive elements.'}
              {page.suggested_action === 'expand_and_refresh' &&
                'Thin page (<1,200 words) currently receiving impressions. High ROI potential by expanding coverage into a comprehensive guide.'}
              {page.suggested_action === 'refresh' &&
                'Proven search demand with clear decay signals. Update facts, stats, references, and republish with new timestamp.'}
              {page.suggested_action === 'monitor' &&
                'Page performance is steady or low demand. Maintain and observe next 30-day reporting cycle.'}
            </p>
          </div>

          {/* Triggered Reason Codes */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Triggered Decision Reasons ({reasons.length})
            </h3>
            <div className="space-y-2">
              {reasons.map((r, i) => (
                <div
                  key={i}
                  className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5 text-xs"
                >
                  <div className="font-mono font-semibold text-teal-300 mb-0.5">
                    {r}
                  </div>
                  <div className="text-slate-400 text-[11px] leading-snug">
                    {getReasonExplanation(r)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Observed Performance Signals (90-Day Window)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Impressions (90d)</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {Number(page.impressions_90d).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Clicks (90d)</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {Number(page.clicks_90d).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Avg SERP Position</div>
                <div className="text-sm font-bold text-teal-400 font-mono mt-0.5">
                  #{Number(page.avg_position).toFixed(1)}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Click-Through Rate</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {(Number(page.ctr) * 100).toFixed(2)}%
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Content Age</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {page.content_age_days} days
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Days Since Update</div>
                <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                  {page.days_since_last_update} days
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Word Count</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {Number(page.word_count).toLocaleString()} words
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Trend Direction</div>
                <div className="flex items-center gap-1 text-sm font-bold mt-0.5">
                  {page.trend_direction === 'down' && (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400 capitalize">Declining</span>
                    </>
                  )}
                  {page.trend_direction === 'flat' && (
                    <>
                      <Minus className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400 capitalize">Flat</span>
                    </>
                  )}
                  {page.trend_direction === 'up' && (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 capitalize">Growing</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2.5">
                <div className="text-[11px] text-slate-400">Search Intent</div>
                <div className="text-sm font-bold text-white capitalize mt-0.5">
                  {page.main_intent}
                </div>
              </div>
            </div>
          </div>

          {/* Action Checklist */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Editorial Verification Checklist
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <label className="flex items-start gap-2 p-2 bg-slate-950/30 rounded border border-slate-800/60 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded border-slate-700 text-teal-500" />
                <span>Verify page is still serving intended commercial or educational audience</span>
              </label>
              <label className="flex items-start gap-2 p-2 bg-slate-950/30 rounded border border-slate-800/60 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded border-slate-700 text-teal-500" />
                <span>Review competing top 3 ranking URLs in Google SERP</span>
              </label>
              <label className="flex items-start gap-2 p-2 bg-slate-950/30 rounded border border-slate-800/60 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded border-slate-700 text-teal-500" />
                <span>Check for outdated dates, broken external citations, or obsolete tools</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <button
            onClick={() => onSimulate(page)}
            className="flex-1 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-teal-500/20"
          >
            <span>Simulate in Opportunity Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
