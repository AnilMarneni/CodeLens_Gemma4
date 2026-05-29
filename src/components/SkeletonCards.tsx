import React from 'react';

export const SkeletonCards: React.FC = () => {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto animate-pulse select-none">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div className="space-y-2.5">
          <div className="h-3 w-28 bg-slate-800"></div>
          <div className="h-6 w-64 bg-slate-800"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-slate-800 border border-brand-border"></div>
          <div className="h-8 w-24 bg-slate-800 border border-brand-border"></div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Confidence & Key Findings */}
        <div className="md:col-span-1 space-y-6">
          {/* Confidence Meter Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 p-5 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="h-3.5 w-28 bg-slate-800 mb-4"></div>
              
              {/* Sleek Linear Shimmer Bar */}
              <div className="w-full h-8 bg-[#0A0A0A] border border-brand-border/60 relative overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4B8EFF]/20 to-transparent -translate-x-full animate-shimmer-x"></div>
                <div className="absolute inset-0 flex items-center justify-between px-3 font-mono text-[9px] text-[#4B8EFF]/40 font-bold uppercase tracking-wider">
                  <span>INFERENCE_SCAN</span>
                  <span>CALCULATING</span>
                </div>
              </div>
            </div>
            <div className="h-3 w-20 bg-slate-800"></div>
          </div>

          {/* Key Findings Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 p-5 space-y-4">
            <div className="h-3.5 w-32 bg-slate-800"></div>
            <div className="space-y-2.5">
              <div className="h-3 w-full bg-slate-800"></div>
              <div className="h-3 w-[90%] bg-slate-800"></div>
              <div className="h-3 w-[95%] bg-slate-800"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Issues & Suggestions */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 p-5 space-y-3">
            <div className="h-3.5 w-24 bg-slate-800"></div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-800"></div>
              <div className="h-3.5 w-[96%] bg-slate-800"></div>
            </div>
          </div>

          {/* Grid for Issues & Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Issues Card Skeleton */}
            <div className="border border-brand-border bg-brand-card/45 p-5 space-y-4">
              <div className="h-3.5 w-36 bg-slate-800"></div>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-full bg-slate-800 mt-0.5"></div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-[85%] bg-slate-800 mt-0.5"></div>
                </div>
              </div>
            </div>

            {/* Suggestions Card Skeleton */}
            <div className="border border-brand-border bg-brand-card/45 p-5 space-y-4">
              <div className="h-3.5 w-40 bg-slate-800"></div>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-full bg-slate-800 mt-0.5"></div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-[80%] bg-slate-800 mt-0.5"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 p-5 space-y-4">
            <div className="h-3.5 w-32 bg-slate-800"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-3.5 h-3.5 bg-slate-800 shrink-0"></div>
                  <div className="h-3.5 w-full bg-slate-800"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
