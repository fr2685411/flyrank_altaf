import React, { useState } from 'react';
import { SimulatorInputs } from '../types';
import { simulatePageScore } from '../utils/scoring';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface SimulatorProps {
  initialInputs?: SimulatorInputs | null;
}

export const Simulator: React.FC<SimulatorProps> = ({ initialInputs }) => {
  const [inputs, setInputs] = useState<SimulatorInputs>(
    initialInputs || {
      impressions_90d: 12500,
      clicks_90d: 8,
      sessions_90d: 55,
      avg_position: 6.8,
      ctr: 0.06,
      content_age_days: 180,
      days_since_last_update: 160,
      word_count: 1400,
      trend_direction: 'down',
      engagement_rate: 22,
      scroll_rate: 28,
    }
  );

  const result = simulatePageScore(inputs);

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'decaying_anchor':
        setInputs({
          impressions_90d: 18000,
          clicks_90d: 14,
          sessions_90d: 45,
          avg_position: 4.2,
          ctr: 0.08,
          content_age_days: 240,
          days_since_last_update: 190,
          word_count: 1650,
          trend_direction: 'down',
          engagement_rate: 25,
          scroll_rate: 32,
        });
        break;
      case 'low_ctr_striking':
        setInputs({
          impressions_90d: 9500,
          clicks_90d: 5,
          sessions_90d: 20,
          avg_position: 8.5,
          ctr: 0.05,
          content_age_days: 150,
          days_since_last_update: 110,
          word_count: 1800,
          trend_direction: 'down',
          engagement_rate: 40,
          scroll_rate: 45,
        });
        break;
      case 'thin_opportunity':
        setInputs({
          impressions_90d: 4200,
          clicks_90d: 12,
          sessions_90d: 35,
          avg_position: 9.1,
          ctr: 0.28,
          content_age_days: 90,
          days_since_last_update: 80,
          word_count: 650,
          trend_direction: 'flat',
          engagement_rate: 35,
          scroll_rate: 30,
        });
        break;
      case 'healthy_evergreen':
        setInputs({
          impressions_90d: 22000,
          clicks_90d: 750,
          sessions_90d: 820,
          avg_position: 2.3,
          ctr: 3.4,
          content_age_days: 300,
          days_since_last_update: 30,
          word_count: 2400,
          trend_direction: 'up',
          engagement_rate: 68,
          scroll_rate: 72,
        });
        break;
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            REAL-TIME CALIBRATED ENGINE
          </span>
          <span className="text-xs text-slate-400">Exact FlyRank Scoring Formula</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Content Refresh Opportunity Simulator
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Enter any page&apos;s search metrics or choose a real archetype to see how the
          blended Random Forest model and heuristic baseline evaluate its refresh urgency.
        </p>
      </div>

      {/* Preset Archetypes */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Load Archetype:
        </span>
        <button
          onClick={() => applyPreset('decaying_anchor')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Decaying Page 1 Anchor
        </button>
        <button
          onClick={() => applyPreset('low_ctr_striking')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Low CTR Striking Distance
        </button>
        <button
          onClick={() => applyPreset('thin_opportunity')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Thin Content Under 1.2k Words
        </button>
        <button
          onClick={() => applyPreset('healthy_evergreen')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Healthy Evergreen Guide
        </button>
      </div>

      {/* Simulator Layout: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Controls (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-400" />
              Content Performance Parameters
            </h2>
            <button
              onClick={() => applyPreset('decaying_anchor')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Impressions Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">90d Impressions</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.impressions_90d.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="50000"
                step="250"
                value={inputs.impressions_90d}
                onChange={(e) =>
                  setInputs({ ...inputs, impressions_90d: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>100</span>
                <span>25k</span>
                <span>50k</span>
              </div>
            </div>

            {/* Average Position Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Avg SERP Position</span>
                <span className="font-mono text-teal-400 font-bold">
                  #{inputs.avg_position.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="50.0"
                step="0.5"
                value={inputs.avg_position}
                onChange={(e) =>
                  setInputs({ ...inputs, avg_position: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>#1 (Page 1)</span>
                <span>#10</span>
                <span>#50</span>
              </div>
            </div>

            {/* CTR Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Click-Through Rate (CTR)</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.ctr.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.02"
                value={inputs.ctr}
                onChange={(e) => setInputs({ ...inputs, ctr: Number(e.target.value) })}
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0.0%</span>
                <span>0.5% (Threshold)</span>
                <span>5.0%</span>
              </div>
            </div>

            {/* Trend Direction */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-300 font-medium">Trend Direction (30d vs Prev 30d)</div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, trend_direction: 'down' })}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 border transition-all ${
                    inputs.trend_direction === 'down'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Down</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, trend_direction: 'flat' })}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 border transition-all ${
                    inputs.trend_direction === 'flat'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Flat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputs({ ...inputs, trend_direction: 'up' })}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 border transition-all ${
                    inputs.trend_direction === 'up'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Up</span>
                </button>
              </div>
            </div>

            {/* Days Since Last Update Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Days Since Update</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.days_since_last_update} days
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={inputs.days_since_last_update}
                onChange={(e) =>
                  setInputs({ ...inputs, days_since_last_update: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10d</span>
                <span>180d (Stale)</span>
                <span>400d</span>
              </div>
            </div>

            {/* Word Count Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Word Count</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.word_count.toLocaleString()} words
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="4000"
                step="50"
                value={inputs.word_count}
                onChange={(e) =>
                  setInputs({ ...inputs, word_count: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>300</span>
                <span>1,200 (Thin threshold)</span>
                <span>4,000</span>
              </div>
            </div>

            {/* Sessions (90d) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">90d Sessions</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.sessions_90d}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={inputs.sessions_90d}
                onChange={(e) =>
                  setInputs({ ...inputs, sessions_90d: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            {/* Engagement Rate (%) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Engagement Rate</span>
                <span className="font-mono text-teal-400 font-bold">
                  {inputs.engagement_rate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="85"
                step="1"
                value={inputs.engagement_rate}
                onChange={(e) =>
                  setInputs({ ...inputs, engagement_rate: Number(e.target.value) })
                }
                className="w-full accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Output Diagnostic (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Calculated Refresh Urgency
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                  result.confidence === 'high'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : result.confidence === 'medium'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-700/40 text-slate-400 border-slate-700'
                }`}
              >
                {result.confidence} confidence
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <div className="text-5xl font-extrabold text-teal-400 font-mono tracking-tight">
                {result.finalRefreshScore.toFixed(1)}
              </div>
              <span className="text-slate-500 font-mono text-sm">/ 100</span>
            </div>

            {/* Score progress bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 mb-4">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-300 rounded-full transition-all duration-300"
                style={{ width: `${result.finalRefreshScore}%` }}
              />
            </div>

            {/* Formula Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Model Probability (70%):</span>
                <div className="font-mono font-bold text-white text-sm">
                  {(result.modelProbability * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-slate-400">Baseline Rule Score (30%):</span>
                <div className="font-mono font-bold text-slate-300 text-sm">
                  {(result.baselineScore * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Prescribed Action
            </div>

            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${getActionBadgeColor(
                result.suggestedAction
              )}`}
            >
              {result.suggestedAction.replace(/_/g, ' ')}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.actionDescription}
            </p>

            {/* Checklist */}
            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-semibold mb-2">Actionable Checklist:</div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Triggered Reason Codes */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
              Triggered Heuristic &amp; Model Signals ({result.reasonCodes.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.reasonCodes.map((reason, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-teal-300 font-mono text-[11px] rounded"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
