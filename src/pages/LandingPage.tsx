import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, FileCode, CheckCircle2, Layout, GitMerge, Terminal, ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onTrySamples: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis, onTrySamples }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  const features = [
    {
      title: 'Error Debugging',
      desc: 'Trace compiler stack traces and unhandled exceptions. Receive root cause reports and copy-pasteable hotfix patches.',
      icon: <Bug className="w-4 h-4 text-red-400" />
    },
    {
      title: 'Code Understanding',
      desc: 'Evaluate modular structures, inspect dependencies, verify clean architecture parameters, and inspect code schemas.',
      icon: <FileCode className="w-4 h-4 text-[#4B8EFF]" />
    },
    {
      title: 'Interview Preparation',
      desc: 'Decompose LeetCode questions, trace complexities, and output solution roadmaps with optimal code.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    },
    {
      title: 'UI Analysis',
      desc: 'Deconstruct mobile and web user interface mockups. Extract layouts, alignments, and functional React components.',
      icon: <Layout className="w-4 h-4 text-purple-400" />
    },
    {
      title: 'Architecture Review',
      desc: 'Scan system diagrams. Locate database bottlenecks, single points of failure (SPOF), and caching optimization gaps.',
      icon: <GitMerge className="w-4 h-4 text-blue-400" />
    },
    {
      title: 'Terminal Output',
      desc: 'Scan webpack logs, build output, or docker compose logs. Extract and execute correct command repairs.',
      icon: <Terminal className="w-4 h-4 text-orange-400" />
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center select-none"
    >
      {/* Background lines grid */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 -z-10 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Title & Headline */}
      <motion.div variants={itemVariants} className="max-w-4xl space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-brand-border text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4B8EFF] animate-pulse"></span>
          <span>Status: Connected</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans leading-tight">
          Transform Developer Screenshots<br />
          <span className="text-[#4B8EFF] lowercase font-mono font-medium tracking-normal">
            into_actionable_intelligence.
          </span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed font-light font-sans">
          Analyze code, bugs, diagrams, UI mockups, terminal output, and architecture screenshots using a locally running Gemma 4 Vision model.
        </p>
      </motion.div>

      {/* Hero Buttons */}
      <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center text-[10px] tracking-wider font-bold font-mono">
        <button
          onClick={onStartAnalysis}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent text-white border border-[#4B8EFF] hover:bg-[#4B8EFF]/10 transition-colors"
        >
          <span>Open Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onTrySamples}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-card hover:bg-brand-sec text-slate-400 hover:text-white border border-brand-border hover:border-slate-600 transition-colors"
        >
          <span>Use Demo Examples</span>
        </button>
      </motion.div>

      {/* Hero Statistics Section */}
      <motion.div 
        variants={itemVariants} 
        className="w-full max-w-5xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono select-text"
      >
        <div className="border border-brand-border bg-[#111111] p-4 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-white">9</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 text-center">Screenshot Types Supported</span>
        </div>
        <div className="border border-brand-border bg-[#111111] p-4 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-[#4B8EFF]">100%</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 text-center">Local AI Processing</span>
        </div>
        <div className="border border-brand-border bg-[#111111] p-4 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-white">0</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 text-center">External AI APIs</span>
        </div>
        <div className="border border-brand-border bg-[#111111] p-4 flex flex-col items-center justify-center col-span-2 md:col-span-1">
          <span className="text-xs sm:text-sm font-bold text-[#4B8EFF] uppercase mt-1">Gemma 4 Vision</span>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 text-center">Underlying Model</span>
        </div>
      </motion.div>

      {/* Why CodeLens Section */}
      <motion.div 
        variants={itemVariants} 
        className="w-full max-w-5xl mt-14 p-6 sm:p-8 border border-brand-border bg-[#111111] text-left select-text"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider font-sans">Why CodeLens?</h2>
            <p className="text-xs text-slate-400 mt-2.5 font-sans leading-relaxed">
              Developers waste time switching between tools. CodeLens brings together essential visual diagnostics tools into a single workspace.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[#4B8EFF] font-bold shrink-0 mt-0.5">▪</span>
              <div>
                <strong className="text-white block font-sans">Error Debugging</strong>
                <span className="text-[11px] text-slate-500 leading-normal font-sans">Extract call stack traces and suggest instant, copy-pasteable patches.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[#4B8EFF] font-bold shrink-0 mt-0.5">▪</span>
              <div>
                <strong className="text-white block font-sans">Code Understanding</strong>
                <span className="text-[11px] text-slate-500 leading-normal font-sans">Inspect screenshots of complex files and modules to audit code logic.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[#4B8EFF] font-bold shrink-0 mt-0.5">▪</span>
              <div>
                <strong className="text-white block font-sans">Interview Preparation</strong>
                <span className="text-[11px] text-slate-500 leading-normal font-sans">Convert LeetCode problem prompts into algorithmic approaches.</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[#4B8EFF] font-bold shrink-0 mt-0.5">▪</span>
              <div>
                <strong className="text-white block font-sans">UI & Architecture Review</strong>
                <span className="text-[11px] text-slate-500 leading-normal font-sans">Audit interface layouts and microservices blueprints for bottlenecks.</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div variants={itemVariants} className="w-full max-w-5xl mt-14 space-y-6">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">How It Works</h2>
        
        {/* Workflow representation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-400 select-text">
          <div className="border border-brand-border bg-[#111111] px-4 py-3 flex-1 w-full text-center">
            <span className="text-white font-bold block">Upload Screenshot</span>
            <span className="text-[8px] text-slate-500 mt-0.5 block">File Input / Sample Select</span>
          </div>
          <div className="text-slate-600 font-bold shrink-0">→</div>
          <div className="border border-[#4B8EFF]/40 bg-[#111111] px-4 py-3 flex-1 w-full text-center">
            <span className="text-[#4B8EFF] font-bold block">Gemma 4 Vision</span>
            <span className="text-[8px] text-slate-500 mt-0.5 block">Running Locally Through Ollama</span>
          </div>
          <div className="text-slate-600 font-bold shrink-0">→</div>
          <div className="border border-brand-border bg-[#111111] px-4 py-3 flex-1 w-full text-center">
            <span className="text-white font-bold block">Image Classification</span>
            <span className="text-[8px] text-slate-500 mt-0.5 block">Autonomous Type Detection</span>
          </div>
          <div className="text-slate-600 font-bold shrink-0">→</div>
          <div className="border border-brand-border bg-[#111111] px-4 py-3 flex-1 w-full text-center">
            <span className="text-white font-bold block">AI Analysis</span>
            <span className="text-[8px] text-slate-500 mt-0.5 block">Deep Structured Diagnostic Run</span>
          </div>
          <div className="text-slate-600 font-bold shrink-0">→</div>
          <div className="border border-brand-border bg-[#111111] px-4 py-3 flex-1 w-full text-center border-l-4 border-l-[#4B8EFF]">
            <span className="text-white font-bold block">Actionable Results</span>
            <span className="text-[8px] text-slate-500 mt-0.5 block">Solutions & Copyable Patches</span>
          </div>
        </div>
      </motion.div>

      {/* Feature observational grid */}
      <motion.div variants={itemVariants} className="w-full max-w-5xl mt-14 space-y-6">
        <div className="w-full h-[1px] bg-[#262626] mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col p-5 border border-brand-border bg-[#111111]/45 hover:bg-[#111111] hover:border-slate-600 transition-colors"
            >
              <div className="w-8 h-8 bg-[#0A0A0A] flex items-center justify-center border border-[#262626] mb-3">
                {feature.icon}
              </div>
              <h3 className="text-[10px] font-bold text-white tracking-widest uppercase font-mono">{feature.title}</h3>
              <p className="text-[11px] text-slate-400 font-sans mt-2.5 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
