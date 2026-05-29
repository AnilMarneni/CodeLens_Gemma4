import React from 'react';
import { Shield } from 'lucide-react';

interface NavbarProps {
  imagesAnalyzed: number;
  currentTab: 'landing' | 'workspace';
  setTab: (tab: 'landing' | 'workspace') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ imagesAnalyzed, currentTab, setTab }) => {
  return (
    <header className="w-full border-b border-brand-border bg-[#0A0A0A] font-mono select-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs">
        
        {/* Brand logo */}
        <div 
          onClick={() => setTab('landing')}
          className="flex cursor-pointer items-center gap-2 text-white font-sans font-extrabold tracking-wider transition-all hover:opacity-90"
        >
          <div className="flex h-5 w-5 items-center justify-center bg-[#4B8EFF] text-black">
            <Shield className="w-3 h-3 fill-black text-black" />
          </div>
          <span className="font-bold tracking-tight">
            CodeLens<span className="text-[#4B8EFF] font-semibold">AI</span>
          </span>
        </div>

        {/* Tab links */}
        <div className="flex items-center gap-6 h-full font-mono text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          <button
            onClick={() => setTab('landing')}
            className={`h-full relative px-1 transition-colors hover:text-white ${
              currentTab === 'landing' ? 'text-white border-b border-[#4B8EFF] font-semibold' : ''
            }`}
          >
            Features
          </button>
          
          <button
            onClick={() => setTab('workspace')}
            className={`h-full relative px-1 transition-colors hover:text-white ${
              currentTab === 'workspace' ? 'text-white border-b-2 border-[#4B8EFF] font-semibold' : ''
            }`}
          >
            Workspace
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-[10px] tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4B8EFF] animate-pulse"></span>
            <span>Gemma 4</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 border border-brand-border bg-[#111111] px-2.5 py-1 font-mono">
            <span>Analyses:</span>
            <span className="text-[#4B8EFF] font-bold">{imagesAnalyzed}</span>
          </div>

          <button
            onClick={() => setTab(currentTab === 'workspace' ? 'landing' : 'workspace')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-[#111111] hover:bg-[#171717] border border-brand-border text-white transition-all text-[10px] font-bold tracking-wider hover:border-brand-accent/50 active:scale-[0.98]"
          >
            {currentTab === 'workspace' ? 'See Features' : 'Open Workspace'}
          </button>
        </div>

      </div>
    </header>
  );
};
