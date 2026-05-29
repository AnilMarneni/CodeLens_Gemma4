import React from 'react';

export const SkeletonCards: React.FC = () => {
  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div className="space-y-2.5">
          <div className="h-5 w-28 bg-slate-800 rounded-lg"></div>
          <div className="h-9 w-64 bg-slate-800 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
          <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Confidence & Key Findings */}
        <div className="md:col-span-1 space-y-6">
          {/* Confidence Meter Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[160px]">
            <div className="h-4 w-28 bg-slate-800 rounded mb-4"></div>
            <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-brand-accent animate-spin mb-3"></div>
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
          </div>

          {/* Key Findings Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 space-y-4">
            <div className="h-4.5 w-32 bg-slate-800 rounded"></div>
            <div className="space-y-2.5">
              <div className="h-3 w-full bg-slate-800 rounded"></div>
              <div className="h-3 w-[90%] bg-slate-800 rounded"></div>
              <div className="h-3 w-[95%] bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Issues & Suggestions */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 space-y-3">
            <div className="h-4.5 w-24 bg-slate-800 rounded"></div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-slate-800 rounded"></div>
              <div className="h-3.5 w-[96%] bg-slate-800 rounded"></div>
            </div>
          </div>

          {/* Grid for Issues & Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Issues Card Skeleton */}
            <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 space-y-4">
              <div className="h-4.5 w-36 bg-slate-800 rounded"></div>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-full bg-slate-800 rounded mt-0.5"></div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-[85%] bg-slate-800 rounded mt-0.5"></div>
                </div>
              </div>
            </div>

            {/* Suggestions Card Skeleton */}
            <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 space-y-4">
              <div className="h-4.5 w-40 bg-slate-800 rounded"></div>
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-full bg-slate-800 rounded mt-0.5"></div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded bg-slate-800 shrink-0"></div>
                  <div className="h-3 w-[80%] bg-slate-800 rounded mt-0.5"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Card Skeleton */}
          <div className="border border-brand-border bg-brand-card/45 rounded-2xl p-5 space-y-4">
            <div className="h-4.5 w-32 bg-slate-800 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-4 h-4 rounded bg-slate-800 shrink-0"></div>
                  <div className="h-3.5 w-full bg-slate-800 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
