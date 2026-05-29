import React from 'react';
import { Clock, FileText, Settings, FileCode, LayoutGrid } from 'lucide-react';

interface SidebarProps {
  activeTab: 'workspace' | 'history' | 'samples';
  setActiveTab: (tab: 'workspace' | 'history' | 'samples') => void;
  onConfigClick: () => void;
  onDocsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onConfigClick,
  onDocsClick,
}) => {
  return (
    <aside className="w-full lg:w-60 shrink-0 border-r border-brand-border bg-[#0A0A0A] flex flex-col h-full font-mono select-none">
      
      {/* 1. BRAND HEADER */}
      <div className="p-4 border-b border-brand-border flex items-center gap-2 select-none">
        <div className="flex h-5 w-5 items-center justify-center bg-[#4B8EFF] text-black">
          <span className="text-[10px] font-black font-sans">CL</span>
        </div>
        <span className="font-bold tracking-widest text-xs text-white">CODELENS AI</span>
      </div>

      {/* 2. WORKSPACE STATUS */}
      <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between text-[10px]">
        <span className="text-slate-500 font-bold tracking-wider">AI STATUS</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Ready
        </span>
      </div>

      {/* 3. NAVIGATION */}
      <div className="p-4 border-b border-brand-border flex flex-col gap-2.5">
        <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Navigation</span>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 border transition-all text-left text-xs ${
              activeTab === 'workspace'
                ? 'bg-brand-sec border-[#4B8EFF] text-white font-semibold'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-brand-card/30'
            }`}
          >
            <LayoutGrid className={`w-3.5 h-3.5 ${activeTab === 'workspace' ? 'text-[#4B8EFF]' : 'text-slate-500'}`} />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 border transition-all text-left text-xs ${
              activeTab === 'history'
                ? 'bg-brand-sec border-[#4B8EFF] text-white font-semibold'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-brand-card/30'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${activeTab === 'history' ? 'text-[#4B8EFF]' : 'text-slate-500'}`} />
            <span>Recent Analyses</span>
          </button>
          
          <button
            onClick={() => setActiveTab('samples')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 border transition-all text-left text-xs ${
              activeTab === 'samples'
                ? 'bg-brand-sec border-[#4B8EFF] text-white font-semibold'
                : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-brand-card/30'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${activeTab === 'samples' ? 'text-[#4B8EFF]' : 'text-slate-500'}`} />
            <span>Sample Analyses</span>
          </button>
        </div>
      </div>

      {/* spacer to push config to bottom */}
      <div className="flex-1"></div>

      {/* 4. FOOTER CONTROLS */}
      <div className="p-4 border-t border-brand-border bg-brand-card/10 flex flex-col gap-2 font-sans">
        <div className="flex flex-col gap-1 text-[11px] text-slate-400 border-brand-border/40 font-mono">
          <button 
            onClick={onConfigClick}
            className="flex items-center gap-2 px-2 py-1.5 hover:text-white hover:bg-brand-card/30 transition-colors text-left w-full"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Config</span>
          </button>
          
          <button 
            onClick={onDocsClick}
            className="flex items-center gap-2 px-2 py-1.5 hover:text-white hover:bg-brand-card/30 transition-colors text-left w-full"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Docs & API</span>
          </button>
        </div>
      </div>

    </aside>
  );
};
