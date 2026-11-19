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
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface QueueExplorerProps {
  queue: ScoredPage[];
  onSelectPage: (page: ScoredPage) => void;
  onSimulatePage: (page: ScoredPage) => void;
}

interface ClickMomentumSparklineProps {
  contentId: string;
  early: number;
  prev: number;
  last: number;
  trendDirection: 'down' | 'flat' | 'up';
  trendPct?: number;
}

const ClickMomentumSparkline: React.FC<ClickMomentumSparklineProps> = ({
  contentId,
  early,
  prev,
  last,
  trendDirection,
  trendPct,
}) => {
  const points = [early, prev, last];
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const isAllZero = maxVal === 0;

  const xCoords = [6, 44, 82];
  const yCoords = points.map((val) => {
    if (isAllZero) return 21;
    if (maxVal === minVal) return 14;
    return 23 - ((val - minVal) / (maxVal - minVal)) * 17;
  });

  const strokeColor = isAllZero
    ? '#64748b'
    : trendDirection === 'down'
      ? '#fb7185'
      : trendDirection === 'up'
        ? '#34d399'
        : '#fbbf24';

  const polylinePoints = xCoords.map((x, i) => `${x},${yCoords[i].toFixed(1)}`).join(' ');
  const areaPoints = `6,26 ${polylinePoints} 82,26`;
  const gradId = `spark-grad-${contentId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const pctLabel =
    typeof trendPct === 'number' && Number.isFinite(trendPct)
      ? `${trendPct > 0 ? '+' : ''}${trendPct.toFixed(1)}%`
      : trendDirection;

  return (
    <div
      className="group/spark relative inline-flex items-center gap-2.5"
      title={`90d Clicks: D1–30 (${early}) → D31–60 (${prev}) → D61–90 (${last}) · ${pctLabel}`}
      aria-label={`90-day click momentum: Days 1-30 ${early} clicks, Days 31-60 ${prev} clicks, Days 61-90 ${last} clicks (${pctLabel})`}
    >
      <svg
        width={88}
        height={28}
        viewBox="0 0 88 28"
        className="shrink-0 overflow-visible"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.28} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {!isAllZero && <polygon points={areaPoints} fill={`url(#${gradId})`} />}

        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isAllZero ? '3 3' : undefined}
          points={polylinePoints}
        />

        <circle cx={xCoords[0]} cy={yCoords[0]} r={1.6} fill={strokeColor} opacity={0.65} />
        <circle cx={xCoords[1]} cy={yCoords[1]} r={1.6} fill={strokeColor} opacity={0.8} />
        <circle cx={xCoords[2]} cy={yCoords[2]} r={2.6} fill={strokeColor} />
      </svg>

      {/* Hover detail popover */}
      <div className="pointer-events-none opacity-0 group-hover/spark:opacity-100 transition-opacity duration-150 absolute bottom-full right-0 mb-1.5 z-20 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 shadow-xl text-[11px] font-mono tabular-nums whitespace-nowrap">
        <div className="text-slate-400 mb-1">90d Click Windows</div>
        <div className="flex items-center gap-2 text-slate-200">
          <span>D1–30: {early}</span>
          <span className="text-slate-600">→</span>
          <span>D31–60: {prev}</span>
          <span className="text-slate-600">→</span>
          <span className="font-bold text-white">D61–90: {last}</span>
        </div>
      </div>
    </div>
  );
};

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
  const [scoreMetric, setScoreMetric] = useState<'score' | 'prob'>('score');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const resetFilters = () => {
    setSearchQuery('');
    setActionFilter('ALL');
    setConfidenceFilter('ALL');
    setTrendFilter('ALL');
    setPositionFilter('ALL');
    setCurrentPage(1);
  };

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

  // Dynamic Recharts histogram bins across the current (filtered) queue
  const histogramStats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        bins: [] as {
          label: string;
          range: string;
          highConfidence: number;
          standardConfidence: number;
          total: number;
          pct: number;
        }[],
        mean: 0,
        median: 0,
        min: 0,
        max: 0,
      };
    }

    const entries = filteredData
      .map((item) => ({
        value:
          scoreMetric === 'score'
            ? Number(item.final_refresh_score)
            : Number(item.best_model_probability) * 100,
        isHigh: item.confidence === 'high',
      }))
      .filter((e) => Number.isFinite(e.value));

    if (entries.length === 0) {
      return { bins: [], mean: 0, median: 0, min: 0, max: 0 };
    }

    const sortedVals = entries.map((e) => e.value).sort((a, b) => a - b);
    const min = sortedVals[0];
    const max = sortedVals[sortedVals.length - 1];
    const mean = sortedVals.reduce((acc, v) => acc + v, 0) / sortedVals.length;
    const mid = Math.floor(sortedVals.length / 2);
    const median =
      sortedVals.length % 2 === 0
        ? (sortedVals[mid - 1] + sortedVals[mid]) / 2
        : sortedVals[mid];

    const rawSpan = Math.max(max - min, 0.5);
    const targetStep = rawSpan / 10;
    const niceSteps = [0.5, 1, 2, 2.5, 5, 10, 20];
    const step = niceSteps.find((s) => s >= targetStep) ?? 20;

    const binStart = Math.floor(min / step) * step;
    let binEndLimit = Math.ceil(max / step) * step;
    if (binEndLimit <= binStart) {
      binEndLimit = binStart + step;
    }

    const binCount = Math.max(1, Math.round((binEndLimit - binStart) / step));
    const unit = scoreMetric === 'prob' ? '%' : '';
    const decimals = step < 1 ? 1 : 0;

    const bins = Array.from({ length: binCount }, (_, idx) => {
      const start = binStart + idx * step;
      const end = start + step;
      return {
        start,
        end,
        label: `${start.toFixed(decimals)}${unit}`,
        range: `${start.toFixed(decimals)}${unit} – ${end.toFixed(decimals)}${unit}`,
        highConfidence: 0,
        standardConfidence: 0,
        total: 0,
        pct: 0,
      };
    });

    entries.forEach(({ value, isHigh }) => {
      let idx = Math.floor((value - binStart) / step);
      if (idx < 0) idx = 0;
      if (idx >= bins.length) idx = bins.length - 1;
      const bin = bins[idx];
      bin.total += 1;
      if (isHigh) {
        bin.highConfidence += 1;
      } else {
        bin.standardConfidence += 1;
      }
    });

    bins.forEach((b) => {
      b.pct = (b.total / entries.length) * 100;
    });

    return { bins, mean, median, min, max };
  }, [filteredData, scoreMetric]);

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

      {/* Model Score Distribution Histogram (Recharts) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400 shrink-0" />
              <h2 className="text-sm font-semibold text-white">
                {scoreMetric === 'score'
                  ? 'Blended Refresh Score Distribution'
                  : 'Random Forest Decline Probability Distribution'}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono tabular-nums">
              <span>n = {filteredData.length} pages</span>
              <span aria-hidden="true">·</span>
              <span>
                Mean:{' '}
                <strong className="text-slate-200">
                  {histogramStats.mean.toFixed(1)}
                  {scoreMetric === 'prob' ? '%' : ''}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Median:{' '}
                <strong className="text-slate-200">
                  {histogramStats.median.toFixed(1)}
                  {scoreMetric === 'prob' ? '%' : ''}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Range:{' '}
                <strong className="text-slate-200">
                  {histogramStats.min.toFixed(1)}–{histogramStats.max.toFixed(1)}
                  {scoreMetric === 'prob' ? '%' : ''}
                </strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500 inline-block" />
                <span>High Confidence</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                <span>Medium / Low</span>
              </div>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setScoreMetric('score')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  scoreMetric === 'score'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Refresh Score (0–100)
              </button>
              <button
                type="button"
                onClick={() => setScoreMetric('prob')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  scoreMetric === 'prob'
                    ? 'bg-teal-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RF Risk Prob (%)
              </button>
            </div>
          </div>
        </div>

        {histogramStats.bins.length > 0 ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart
                data={histogramStats.bins}
                margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
                barCategoryGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const bin = payload[0].payload as {
                      range: string;
                      total: number;
                      highConfidence: number;
                      standardConfidence: number;
                      pct: number;
                    };
                    return (
                      <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 shadow-xl text-xs space-y-1">
                        <div className="font-mono font-semibold text-white">
                          Bin {bin.range}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-300 font-mono tabular-nums">
                          <span>Pages in bin:</span>
                          <span className="font-bold text-white">
                            {bin.total} ({bin.pct.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-teal-400 font-mono tabular-nums">
                          <span>High confidence:</span>
                          <span>{bin.highConfidence}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-400 font-mono tabular-nums">
                          <span>Medium / Low:</span>
                          <span>{bin.standardConfidence}</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Bar
                  dataKey="highConfidence"
                  stackId="queue"
                  fill="#14b8a6"
                  animationDuration={180}
                />
                <Bar
                  dataKey="standardConfidence"
                  stackId="queue"
                  fill="#475569"
                  radius={[3, 3, 0, 0]}
                  animationDuration={180}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center gap-3 border border-dashed border-slate-800 rounded-lg text-xs text-slate-400">
            <span>No articles match the active filters to plot a score distribution.</span>
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          </div>
        )}
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
                <th className="py-3 px-4">90d Click Momentum</th>
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

                    {/* 90d Click Momentum Sparkline */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <ClickMomentumSparkline
                          contentId={item.content_id}
                          early={Number(item.clicks_early_30d ?? 0)}
                          prev={Number(item.clicks_prev_30d ?? 0)}
                          last={Number(item.clicks_last_30d ?? 0)}
                          trendDirection={item.trend_direction}
                          trendPct={item.trend_pct}
                        />
                        <div className="min-w-[66px]">
                          <div className="flex items-center gap-1 font-mono tabular-nums text-[11px] whitespace-nowrap">
                            {item.trend_direction === 'down' && (
                              <>
                                <TrendingDown className="w-3 h-3 text-rose-400 shrink-0" />
                                <span className="text-rose-400 font-semibold">
                                  {typeof item.trend_pct === 'number'
                                    ? `${item.trend_pct.toFixed(0)}%`
                                    : 'down'}
                                </span>
                              </>
                            )}
                            {item.trend_direction === 'flat' && (
                              <>
                                <Minus className="w-3 h-3 text-amber-400 shrink-0" />
                                <span className="text-amber-400 font-semibold">
                                  {typeof item.trend_pct === 'number'
                                    ? `${item.trend_pct > 0 ? '+' : ''}${item.trend_pct.toFixed(0)}%`
                                    : 'flat'}
                                </span>
                              </>
                            )}
                            {item.trend_direction === 'up' && (
                              <>
                                <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span className="text-emerald-400 font-semibold">
                                  {typeof item.trend_pct === 'number'
                                    ? `+${item.trend_pct.toFixed(0)}%`
                                    : 'up'}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono tabular-nums whitespace-nowrap">
                            {Number(item.clicks_early_30d ?? 0)}→{Number(item.clicks_prev_30d ?? 0)}→{Number(item.clicks_last_30d ?? 0)}
                          </div>
                        </div>
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
