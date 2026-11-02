import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

export const RoiPlanner: React.FC = () => {
  const [monthlyPages, setMonthlyPages] = useState<number>(50);
  const [avgClicks, setAvgClicks] = useState<number>(220);
  const [recoveryRate, setRecoveryRate] = useState<number>(30); // 30%
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [effectiveCpc, setEffectiveCpc] = useState<number>(1.8);

  // Time metrics
  const unrankedAuditHoursPerPage = 2.2;
  const prioritizedAuditHoursPerPage = 0.9;
  const hoursSavedPerPage = unrankedAuditHoursPerPage - prioritizedAuditHoursPerPage;

  // Monthly values
  const totalHoursSaved = monthlyPages * hoursSavedPerPage;
  const laborCostSaved = totalHoursSaved * hourlyRate;
  const reclaimedClicks = Math.round(monthlyPages * avgClicks * (recoveryRate / 100));
  const reclaimedTrafficValue = reclaimedClicks * effectiveCpc;
  const totalMonthlyImpact = laborCostSaved + reclaimedTrafficValue;

  const loadPreset = (preset: 'agency' | 'midmarket' | 'enterprise') => {
    switch (preset) {
      case 'agency':
        setMonthlyPages(30);
        setAvgClicks(150);
        setRecoveryRate(25);
        setHourlyRate(45);
        setEffectiveCpc(1.5);
        break;
      case 'midmarket':
        setMonthlyPages(60);
        setAvgClicks(280);
        setRecoveryRate(35);
        setHourlyRate(55);
        setEffectiveCpc(2.2);
        break;
      case 'enterprise':
        setMonthlyPages(150);
        setAvgClicks(450);
        setRecoveryRate(35);
        setHourlyRate(70);
        setEffectiveCpc(3.1);
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-green-500/10 text-green-400 border border-green-500/30 font-mono">
            DECISION SUPPORT ECONOMICS
          </span>
          <span className="text-xs text-slate-400">Door 3 Scenario Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SEO ROI &amp; Review Capacity Planner
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Estimate the tangible labor hours saved and organic search clicks reclaimed by
          prioritizing high-probability decay targets over unranked manual discovery.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-green-400" />
          Scale Presets:
        </span>
        <button
          onClick={() => loadPreset('agency')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Boutique Agency (30 pages/mo)
        </button>
        <button
          onClick={() => loadPreset('midmarket')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Mid-Market Publisher (60 pages/mo)
        </button>
        <button
          onClick={() => loadPreset('enterprise')}
          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-md transition-colors"
        >
          Enterprise Media (150 pages/mo)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-green-400" />
            Editorial Team &amp; Traffic Assumptions
          </h2>

          {/* Monthly pages */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Monthly Pages Reviewed</span>
              <span className="font-mono text-green-400 font-bold">{monthlyPages} pages</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={monthlyPages}
              onChange={(e) => setMonthlyPages(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10</span>
              <span>100</span>
              <span>200</span>
            </div>
          </div>

          {/* Average clicks per decaying page */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Avg Monthly Clicks per At-Risk Page</span>
              <span className="font-mono text-green-400 font-bold">{avgClicks} clicks</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={avgClicks}
              onChange={(e) => setAvgClicks(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Expected recovery rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Expected Post-Refresh Click Rebound</span>
              <span className="font-mono text-green-400 font-bold">{recoveryRate}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={recoveryRate}
              onChange={(e) => setRecoveryRate(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Editorial hourly rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Reviewer Cost per Hour ($)</span>
              <span className="font-mono text-green-400 font-bold">${hourlyRate}/hr</span>
            </div>
            <input
              type="range"
              min="25"
              max="150"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>

          {/* Effective CPC equivalent */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Search CPC Replacement Value ($)</span>
              <span className="font-mono text-green-400 font-bold">${effectiveCpc.toFixed(2)} / click</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={effectiveCpc}
              onChange={(e) => setEffectiveCpc(Number(e.target.value))}
              className="w-full accent-green-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Results Cards (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Value Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-green-500/30 rounded-xl p-6 shadow-2xl relative">
            <div className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-1">
              Total Modeled Monthly Value
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono tracking-tight">
              ${Math.round(totalMonthlyImpact).toLocaleString()}
              <span className="text-sm text-slate-400 font-sans font-normal ml-2">/ month</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Combined value of saved editorial review hours and reclaimed organic traffic.
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Reclaimed Organic Clicks</div>
                <div className="text-2xl font-bold text-teal-400 font-mono mt-0.5">
                  +{reclaimedClicks.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ≈ ${Math.round(reclaimedTrafficValue).toLocaleString()} paid search value
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400">Editorial Hours Saved</div>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">
                  {Math.round(totalHoursSaved)} hrs/mo
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ≈ ${Math.round(laborCostSaved).toLocaleString()} direct labor saved
                </div>
              </div>
            </div>
          </div>

          {/* Time Efficiency Comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Audit Efficiency Comparison
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-300 font-medium">Unranked Manual Discovery</div>
                  <div className="text-[11px] text-slate-500">Sifting spreadsheets and GSC raw exports</div>
                </div>
                <div className="font-mono text-rose-400 font-bold">2.2 hrs / page</div>
              </div>

              <div className="p-3 bg-teal-500/10 rounded-lg border border-teal-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="text-teal-300 font-medium">FlyRank Prioritized Queue</div>
                  <div className="text-[11px] text-teal-400/80">Automated reason codes and triage checklists</div>
                </div>
                <div className="font-mono text-teal-300 font-bold">0.9 hrs / page</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1">
              * Based on reference case study interviews: ML rankers save 1.3 hours per page by
              eliminating exploratory filtering and delivering pre-computed SERP diagnostic reason codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
