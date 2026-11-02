import React, { useState } from 'react';
import queueDataRaw from './data/queueData.json';
import { ScoredPage, SimulatorInputs } from './types';
import { Navigation, ActiveTab } from './components/Navigation';
import { ThreeDoorsView } from './components/ThreeDoorsView';
import { QueueExplorer } from './components/QueueExplorer';
import { Simulator } from './components/Simulator';
import { ModelBenchmarks } from './components/ModelBenchmarks';
import { DataContractView } from './components/DataContractView';
import { RoiPlanner } from './components/RoiPlanner';
import { PageDrawer } from './components/PageDrawer';

const queueData = queueDataRaw as unknown as ScoredPage[];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('doors');
  const [selectedPage, setSelectedPage] = useState<ScoredPage | null>(null);
  const [simulatorInputs, setSimulatorInputs] = useState<SimulatorInputs | null>(null);

  const handleSimulatePage = (page: ScoredPage) => {
    setSimulatorInputs({
      impressions_90d: Number(page.impressions_90d) || 5000,
      clicks_90d: Number(page.clicks_90d) || 10,
      sessions_90d: Number(page.sessions_90d) || 30,
      avg_position: Number(page.avg_position) || 8.0,
      ctr: Number(page.ctr) || 0.1,
      content_age_days: Number(page.content_age_days) || 180,
      days_since_last_update: Number(page.days_since_last_update) || 120,
      word_count: Number(page.word_count) || 1400,
      trend_direction: page.trend_direction || 'down',
      engagement_rate: 25,
      scroll_rate: 30,
    });
    setSelectedPage(null);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Header */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalQueueCount={queueData.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'doors' && (
          <ThreeDoorsView
            onOpenQueue={() => {
              setActiveTab('queue');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSimulator={() => {
              setActiveTab('simulator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'queue' && (
          <QueueExplorer
            queue={queueData}
            onSelectPage={(page) => setSelectedPage(page)}
            onSimulatePage={handleSimulatePage}
          />
        )}

        {activeTab === 'simulator' && (
          <Simulator initialInputs={simulatorInputs} />
        )}

        {activeTab === 'benchmarks' && <ModelBenchmarks />}

        {activeTab === 'contract' && <DataContractView />}

        {activeTab === 'roi' && <RoiPlanner />}
      </main>

      {/* Slide-over Inspection Drawer */}
      <PageDrawer
        page={selectedPage}
        onClose={() => setSelectedPage(null)}
        onSimulate={handleSimulatePage}
      />

      {/* Persistent Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">FlyRank Applied Search Intelligence</span>
            <span>·</span>
            <span>Content Refresh Decision-Support System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Holdout Validated</span>
            <span>·</span>
            <span>Random Forest (P@50: 0.740)</span>
            <span>·</span>
            <span>3 Front Doors Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
