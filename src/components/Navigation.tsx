import React from 'react';
import { BookOpen, Layers, Calculator, BarChart3, ShieldCheck, DollarSign } from 'lucide-react';

export type ActiveTab = 'doors' | 'queue' | 'simulator' | 'benchmarks' | 'contract' | 'roi';

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
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-teal-400 font-mono text-base">
                FR
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">FlyRank</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded">
                  Search Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400">Content Refresh Opportunity ML System</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onTabChange('doors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'doors'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Three Front Doors</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-700/60 text-slate-300">
                3
              </span>
            </button>

            <button
              onClick={() => onTabChange('queue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'queue'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Live Queue Explorer</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300">
                {totalQueueCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('simulator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Refresh Simulator</span>
            </button>

            <button
              onClick={() => onTabChange('benchmarks')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'benchmarks'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Model Benchmarks</span>
            </button>

            <button
              onClick={() => onTabChange('contract')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'contract'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Data Contract</span>
            </button>

            <button
              onClick={() => onTabChange('roi')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'roi'
                  ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-4 h-4 text-green-400" />
              <span>ROI Scenario</span>
            </button>
          </nav>

          {/* Right Header Status */}
          <div className="flex items-center gap-2.5 text-xs">
            <span className="hidden sm:inline-block px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
              RF Best: <strong className="text-white">0.74 P@50</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Scroller */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900/80 border-t border-slate-800 gap-1.5 scrollbar-none">
        <button
          onClick={() => onTabChange('doors')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'doors' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Three Doors
        </button>
        <button
          onClick={() => onTabChange('queue')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'queue' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Queue ({totalQueueCount})
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'simulator' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onTabChange('benchmarks')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'benchmarks' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Benchmarks
        </button>
        <button
          onClick={() => onTabChange('contract')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'contract' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          Data Contract
        </button>
        <button
          onClick={() => onTabChange('roi')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'roi' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'
          }`}
        >
          ROI Planner
        </button>
      </div>
    </header>
  );
};
