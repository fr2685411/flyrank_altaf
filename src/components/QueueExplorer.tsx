import React, { useState, useMemo } from 'react';
import { ScoredPage } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface QueueExplorerProps {
  queue: ScoredPage[];
  onSelectPage: (page: ScoredPage) => void;
  onSimulatePage: (page: ScoredPage) => void;
}

export const QueueExplorer: React.FC<QueueExplorerProps> = ({
  queue,
  onSelectPage,
  onSimulatePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [confidenceFilter, setConfidenceFilter] = useState('ALL');
  const [trendFilter, setTrendFilter] = useState('ALL');
  const [positionFilter, setPositionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'prob' | 'baseline' | 'imp' | 'pos' | 'age'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    return queue.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.content_id.toLowerCase().includes(q);
        const matchesClient = item.client_id.toLowerCase().includes(q);
        const matchesReasons = item.final_reason_codes.toLowerCase().includes(q);
        const matchesAction = item.suggested_action.toLowerCase().includes(q);
        if (!matchesId && !matchesClient && !matchesReasons && !matchesAction) {
          return false;
        }
      }

      // Action
      if (actionFilter !== 'ALL' && item.suggested_action !== actionFilter) {
        return false;
      }

      // Confidence
      if (confidenceFilter !== 'ALL' && item.confidence !== confidenceFilter) {
        return false;
      }

      // Trend
      if (trendFilter !== 'ALL' && item.trend_direction !== trendFilter) {
        return false;
      }

      // Position
      if (positionFilter !== 'ALL') {
        const pos = Number(item.avg_position);
        if (positionFilter === 'page1' && (pos <= 0 || pos > 10)) return false;
        if (positionFilter === 'striking' && (pos < 10.1 || pos > 20)) return false;
        if (positionFilter === 'beyond' && pos <= 20) return false;
      }

      return true;
    });
  }, [queue, searchQuery, actionFilter, confidenceFilter, trendFilter, positionFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortBy) {
        case 'score':
          valA = Number(a.final_refresh_score);
          valB = Number(b.final_refresh_score);
          break;
        case 'prob':
          valA = Number(a.best_model_probability);
          valB = Number(b.best_model_probability);
          break;
        case 'baseline':
          valA = Number(a.baseline_refresh_score);
          valB = Number(b.baseline_refresh_score);
          break;
        case 'imp':
          valA = Number(a.impressions_90d);
          valB = Number(b.impressions_90d);
          break;
        case 'pos':
          valA = Number(a.avg_position);
          valB = Number(b.avg_position);
          break;
        case 'age':
          valA = Number(a.content_age_days);
          valB = Number(b.content_age_days);
          break;
        default:
          valA = Number(a.final_rank);
          valB = Number(b.final_rank);
      }

      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [filteredData, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Summary statistics
  const stats = useMemo(() => {
    const total = queue.length;
    const highConf = queue.filter((i) => i.confidence === 'high').length;
    const declining = queue.filter((i) => i.trend_direction === 'down').length;
    const topActionCount = queue.filter((i) => i.suggested_action === 'refresh_and_review_ctr').length;

    return { total, highConf, declining, topActionCount };
  }, [queue]);

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
        return 'bg-slate-700/30 text-slate-400 border-slate-600/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              PREDICTIVE DECISION SUPPORT
            </span>
            <span className="text-xs text-slate-400">Random Forest Calibrated Ranker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Content Refresh Queue
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Prioritizes published articles that retain organic search visibility but exhibit
            high algorithmic risk of continued click decay.
          </p>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-slate-400">Total Scored</div>
            <div className="text-base font-bold text-white font-mono mt-0.5">{stats.total}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-slate-400">High Confidence</div>
            <div className="text-base font-bold text-teal-400 font-mono mt-0.5">{stats.highConf}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-slate-400">Declining Clicks</div>
            <div className="text-base font-bold text-rose-400 font-mono mt-0.5">{stats.declining}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-slate-400">CTR Overhaul</div>
            <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{stats.topActionCount}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Content ID, Client, or Reason code..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Actions</option>
            <option value="refresh_and_review_ctr">refresh_and_review_ctr</option>
            <option value="refresh">refresh</option>
            <option value="refresh_and_review_engagement">refresh_and_review_engagement</option>
            <option value="expand_and_refresh">expand_and_refresh</option>
            <option value="monitor">monitor</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={confidenceFilter}
            onChange={(e) => {
              setConfidenceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Confidences</option>
            <option value="high">High Confidence</option>
            <option value="medium">Medium Confidence</option>
            <option value="low">Low Confidence</option>
          </select>

          {/* Trend Filter */}
          <select
            value={trendFilter}
            onChange={(e) => {
              setTrendFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Trends</option>
            <option value="down">Declining (Down)</option>
            <option value="flat">Flat</option>
            <option value="up">Growing (Up)</option>
          </select>

          {/* SERP Position Filter */}
          <select
            value={positionFilter}
            onChange={(e) => {
              setPositionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All SERP Ranks</option>
            <option value="page1">Page 1 (Pos 1–10)</option>
            <option value="striking">Striking Distance (11–20)</option>
            <option value="beyond">Page 3+ (20+)</option>
          </select>
        </div>

        {/* Sort & Results Count */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>Showing</span>
            <strong className="text-white font-mono">{filteredData.length}</strong>
            <span>of {queue.length} articles</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 focus:outline-none"
            >
              <option value="score">Opportunity Score</option>
              <option value="prob">Model Probability</option>
              <option value="baseline">Baseline Score</option>
              <option value="imp">Impressions (90d)</option>
              <option value="pos">SERP Position</option>
              <option value="age">Content Age</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800 font-medium">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Page / Client</th>
                <th className="py-3 px-4">Refresh Score</th>
                <th className="py-3 px-4">Model Risk</th>
                <th className="py-3 px-4">Suggested Action</th>
                <th className="py-3 px-4">SERP / CTR</th>
                <th className="py-3 px-4">Demand</th>
                <th className="py-3 px-4">Trend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {paginatedData.map((item) => {
                const score = Number(item.final_refresh_score);
                const prob = Number(item.best_model_probability);
                const reasons = item.final_reason_codes.split('|').filter(Boolean);

                return (
                  <tr
                    key={item.content_id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">
                      <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[11px] group-hover:bg-teal-500/20 group-hover:text-teal-300">
                        {item.final_rank}
                      </span>
                    </td>

                    {/* Content ID */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-white flex items-center gap-1.5">
                        <span>{item.content_id}</span>
                        {item.confidence === 'high' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="High confidence prediction" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.client_id} · {item.main_intent}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400 text-sm">
                          {score.toFixed(1)}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {item.confidence} confidence
                      </div>
                    </td>

                    {/* Model Risk */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-200">
                        {(prob * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        RF decline prob
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${getActionBadgeColor(
                          item.suggested_action
                        )}`}
                      >
                        {item.suggested_action.replace(/_/g, ' ')}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                        {reasons.slice(0, 2).join(', ')}
                        {reasons.length > 2 && ` +${reasons.length - 2} more`}
                      </div>
                    </td>

                    {/* Position / CTR */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-200">
                        Pos #{Number(item.avg_position).toFixed(1)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        CTR: {(Number(item.ctr) * 100).toFixed(2)}%
                      </div>
                    </td>

                    {/* Impressions / Clicks */}
                    <td className="py-3 px-4 font-mono">
                      <div className="text-white">
                        {Number(item.impressions_90d).toLocaleString()} imp
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {Number(item.clicks_90d).toLocaleString()} clk · {item.sessions_90d} ses
                      </div>
                    </td>

                    {/* Trend */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        {item.trend_direction === 'down' && (
                          <>
                            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-rose-400">down</span>
                          </>
                        )}
                        {item.trend_direction === 'flat' && (
                          <>
                            <Minus className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-amber-400">flat</span>
                          </>
                        )}
                        {item.trend_direction === 'up' && (
                          <>
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">up</span>
                          </>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.content_age_days}d old
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectPage(item)}
                          className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center gap-1"
                          title="Inspect page telemetry and reason codes"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span className="hidden sm:inline">Inspect</span>
                        </button>

                        <button
                          onClick={() => onSimulatePage(item)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-slate-300 transition-colors"
                          title="Simulate page in opportunity calculator"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No articles match your active filter criteria. Try resetting filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing Page <strong className="text-white font-mono">{currentPage}</strong> of{' '}
            <strong className="text-white font-mono">{totalPages}</strong> (
            {sortedData.length} total filtered items)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-mono text-slate-300">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
