import React from 'react';
import { BookOpen, Layers, Calculator, BarChart3, ShieldCheck, DollarSign, Presentation } from 'lucide-react';

export type ActiveTab = 'doors' | 'presentation' | 'queue' | 'simulator' | 'benchmarks' | 'contract' | 'roi';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  totalQueueCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  totalQueueCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-teal-400 font-mono text-sm">
              FR
            </div>
            <div className="font-bold text-base tracking-tight text-white whitespace-nowrap shrink-0">
              FlyRank Search Intelligence
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => onTabChange('presentation')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'presentation'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-teal-400" />
              <span>Presentation</span>
            </button>

            <button
              onClick={() => onTabChange('doors')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'doors'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Three Doors</span>
            </button>

            <button
              onClick={() => onTabChange('queue')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'queue'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Queue ({totalQueueCount})</span>
            </button>

            <button
              onClick={() => onTabChange('simulator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulator</span>
            </button>

            <button
              onClick={() => onTabChange('benchmarks')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'benchmarks'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Benchmarks</span>
            </button>

            <button
              onClick={() => onTabChange('contract')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'contract'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Contract</span>
            </button>

            <button
              onClick={() => onTabChange('roi')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'roi'
                  ? 'bg-slate-800 text-teal-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-green-400" />
              <span>ROI</span>
            </button>
          </nav>

          {/* Right Header Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onTabChange('queue')}
              className="hidden sm:inline-flex px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors whitespace-nowrap shrink-0"
            >
              Explore Queue
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Nav Scroller */}
      <div className="xl:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900/80 border-t border-slate-800 gap-1.5 scrollbar-none">
        <button
          onClick={() => onTabChange('presentation')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'presentation' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Presentation
        </button>
        <button
          onClick={() => onTabChange('doors')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'doors' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Three Doors
        </button>
        <button
          onClick={() => onTabChange('queue')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'queue' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Queue ({totalQueueCount})
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onTabChange('benchmarks')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'benchmarks' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Benchmarks
        </button>
        <button
          onClick={() => onTabChange('contract')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'contract' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Contract
        </button>
        <button
          onClick={() => onTabChange('roi')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
            activeTab === 'roi' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          ROI Planner
        </button>
      </div>
    </header>
  );
};
