import React, { useState, useEffect, useRef } from 'react';
import doorsData from '../data/doorsData.json';
import { Eye, BookOpen, Briefcase, Share2, Info, ArrowRight } from 'lucide-react';

interface ThreeDoorsViewProps {
  onOpenQueue: () => void;
  onOpenSimulator: () => void;
}

export const ThreeDoorsView: React.FC<ThreeDoorsViewProps> = ({
  onOpenQueue,
  onOpenSimulator,
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'd1' | 'd2' | 'd3'>('all');
  const [syncScroll, setSyncScroll] = useState<boolean>(false);

  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);
  const pane3Ref = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<boolean>(false);

  // Sync scroll handler
  const handleScroll = (source: 'p1' | 'p2' | 'p3') => {
    if (!syncScroll || isScrollingRef.current) return;
    isScrollingRef.current = true;

    let ratio = 0;
    if (source === 'p1' && pane1Ref.current) {
      ratio = pane1Ref.current.scrollTop / (pane1Ref.current.scrollHeight - pane1Ref.current.clientHeight);
    } else if (source === 'p2' && pane2Ref.current) {
      ratio = pane2Ref.current.scrollTop / (pane2Ref.current.scrollHeight - pane2Ref.current.clientHeight);
    } else if (source === 'p3' && pane3Ref.current) {
      ratio = pane3Ref.current.scrollTop / (pane3Ref.current.scrollHeight - pane3Ref.current.clientHeight);
    }

    if (source !== 'p1' && pane1Ref.current) {
      pane1Ref.current.scrollTop = ratio * (pane1Ref.current.scrollHeight - pane1Ref.current.clientHeight);
    }
    if (source !== 'p2' && pane2Ref.current) {
      pane2Ref.current.scrollTop = ratio * (pane2Ref.current.scrollHeight - pane2Ref.current.clientHeight);
    }
    if (source !== 'p3' && pane3Ref.current) {
      pane3Ref.current.scrollTop = ratio * (pane3Ref.current.scrollHeight - pane3Ref.current.clientHeight);
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 40);
  };

  // Wire up hash links or demo buttons in HTML if clicked
  useEffect(() => {
    const handleArticleClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const demoBtn = target.closest('a[href="#demo"], .btn.primary, a.p2-act');
      if (demoBtn) {
        e.preventDefault();
        onOpenQueue();
      }
    };

    document.addEventListener('click', handleArticleClicks);
    return () => document.removeEventListener('click', handleArticleClicks);
  }, [onOpenQueue]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#0b1020] text-slate-100">
      {/* Top Banner / Invariant Bar */}
      <div className="sticky top-16 z-40 bg-[#0b1020]/95 backdrop-blur border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              One Capstone, Three Front Doors
            </h2>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
              <span>The invariant:</span>
              <strong className="text-teal-300 font-medium">
                the evidence, numbers, and limitations never change.
              </strong>
            </div>
          </div>

          {/* Door View Switcher Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {viewMode === 'all' && (
              <label className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={syncScroll}
                  onChange={(e) => setSyncScroll(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500 focus:ring-teal-400 w-3.5 h-3.5 bg-slate-800"
                />
                <span>Sync Scroll</span>
              </label>
            )}

            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-full p-1 gap-1 text-xs">
              <button
                onClick={() => setViewMode('all')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  viewMode === 'all'
                    ? 'bg-teal-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All 3 Doors
              </button>

              <button
                onClick={() => setViewMode('d1')}
                className={`px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'd1'
                    ? 'bg-[#0d2a5e] text-blue-100 shadow border border-blue-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Door 1: ML Engineers & Reviewers"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                <span>Door 1: Research Paper</span>
              </button>

              <button
                onClick={() => setViewMode('d2')}
                className={`px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'd2'
                    ? 'bg-[#123524] text-emerald-100 shadow border border-emerald-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Door 2: Employers & Technical Interviews"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-300" />
                <span>Door 2: Case Study</span>
              </button>

              <button
                onClick={() => setViewMode('d3')}
                className={`px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'd3'
                    ? 'bg-[#4a2c08] text-amber-100 shadow border border-amber-400/30'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Door 3: SEO Community & Playbook"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Door 3: SEO Playbook</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panes Stage */}
      <div className="flex-1 w-full p-3 sm:p-4">
        <div
          className={`grid gap-4 h-[calc(100vh-140px)] ${
            viewMode === 'all'
              ? 'grid-cols-1 xl:grid-cols-3'
              : 'grid-cols-1 max-w-5xl mx-auto'
          }`}
        >
          {/* DOOR 1 PANE */}
          {(viewMode === 'all' || viewMode === 'd1') && (
            <div
              ref={pane1Ref}
              onScroll={() => handleScroll('p1')}
              className="pane pane1 rounded-xl shadow-2xl bg-[#fdfdfb] text-[#161a22] overflow-y-auto relative border border-blue-900/40"
            >
              <div className="door-tag sticky top-0 z-20 bg-[#0d2a5e] text-[#bcd3ff] px-4 py-2 font-mono text-xs font-bold tracking-wider flex items-center justify-between border-b border-blue-950">
                <span>DOOR 1 · ML ENGINEERS & REVIEWERS · CREDIBILITY</span>
                <span className="text-[11px] opacity-80 hidden sm:inline">Source Serif 4 · Numbered</span>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: (doorsData as any).door1.html }}
                className="prose-container"
              />
            </div>
          )}

          {/* DOOR 2 PANE */}
          {(viewMode === 'all' || viewMode === 'd2') && (
            <div
              ref={pane2Ref}
              onScroll={() => handleScroll('p2')}
              className="pane pane2 rounded-xl shadow-2xl bg-[#fafafa] text-[#0f172a] overflow-y-auto relative border border-emerald-900/40"
            >
              <div className="door-tag sticky top-0 z-20 bg-[#123524] text-[#a7f3c9] px-4 py-2 font-mono text-xs font-bold tracking-wider flex items-center justify-between border-b border-emerald-950">
                <span>DOOR 2 · EMPLOYERS & INTERVIEWS · PROOF OF KNOWLEDGE</span>
                <button
                  onClick={onOpenQueue}
                  className="text-[11px] bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                >
                  <span>Interactive Queue</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: (doorsData as any).door2.html }}
                className="prose-container"
              />
            </div>
          )}

          {/* DOOR 3 PANE */}
          {(viewMode === 'all' || viewMode === 'd3') && (
            <div
              ref={pane3Ref}
              onScroll={() => handleScroll('p3')}
              className="pane pane3 rounded-xl shadow-2xl bg-[#fffdf9] text-[#1f2937] overflow-y-auto relative border border-amber-900/40"
            >
              <div className="door-tag sticky top-0 z-20 bg-[#4a2c08] text-[#fcd9a8] px-4 py-2 font-mono text-xs font-bold tracking-wider flex items-center justify-between border-b border-amber-950">
                <span>DOOR 3 · SEO COMMUNITY · SHAREABLE INSIGHT</span>
                <button
                  onClick={onOpenSimulator}
                  className="text-[11px] bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                >
                  <span>Try Simulator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: (doorsData as any).door3.html }}
                className="prose-container"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
