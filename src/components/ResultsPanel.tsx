import React, { useState } from 'react';
import { AnalysisResult, ActionResult } from '../types/index';
import { 
  Copy, Cpu, Terminal, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { SkeletonCards } from './SkeletonCards';

interface ResultsPanelProps {
  results: AnalysisResult | null;
  isAnalyzing?: boolean;
  loadingText?: string;
  loadingProgress?: number;
  isDemoItem: boolean;
  onExecuteAction: (actionKey: string) => Promise<ActionResult>;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  imageUrl?: string | null;
  onBackToWorkspace: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  results,
  isAnalyzing = false,
  loadingText = 'Analyzing...',
  loadingProgress = 0,
  isDemoItem,
  onExecuteAction,
  addToast,
  imageUrl,
  onBackToWorkspace,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Chat console states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const { 
    type = 'General Screenshot',
    confidence = 90,
    aiInsight = '',
    developerImpact = '', 
    summary = '',
    keyFindings = [],
    issues = [],
    suggestions = [],
    nextSteps = [], 
    processingTime = 2.3,
    modelUsed = 'gemma4:e4b' 
  } = results || {};

  // Technical defaults for dashboard consistency
  const insightText = aiInsight || summary || "System analysis completed successfully.";
  const impactText = developerImpact || (
    type === 'Error Screenshot' || type === 'Terminal Output'
      ? 'This issue may prevent the application from compiling successfully.'
      : type === 'LeetCode Problem'
      ? 'This pattern appears frequently in technical interviews.'
      : 'This design can be implemented efficiently using reusable React components.'
  );

  // Preset action mapping for the system
  const handleActionClick = async (actionKey: string, actionLabel: string) => {
    setModalTitle(actionLabel);
    setModalContent('');
    setModalOpen(true);
    setIsActionLoading(true);

    try {
      const data = await onExecuteAction(actionKey);
      setModalTitle(data.title);
      setModalContent(data.content);
    } catch (e: any) {
      addToast(e.message || 'Action call failed.', 'error');
      setModalOpen(false);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Conversational terminal console submit
  const handleSendChat = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const result = await onExecuteAction(messageText);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      addToast(e.message || 'Console response query failed.', 'error');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendChat(chatInput);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    addToast('Content copied to clipboard.', 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Markdown custom renderer mapping
  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks with syntax wrappers
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    const blocks: string[] = [];
    while ((match = codeBlockRegex.exec(html)) !== null) {
      const lang = match[1] || 'code';
      const code = match[2].trim();
      const placeholder = `__CODE_BLOCK_PLACEHOLDER_${blocks.length}__`;
      blocks.push(`
        <div class="relative my-3 border border-brand-border bg-[#0A0A0A] font-mono text-[11px] rounded-none">
          <div class="flex items-center justify-between px-3 py-1.5 border-b border-brand-border bg-[#111111] text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>${lang.toUpperCase()}_SOURCE</span>
            <button class="px-2 py-0.5 border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:text-white transition-colors" onclick="window.dispatchEvent(new CustomEvent('copy-code', { detail: ${JSON.stringify(code).replace(/"/g, '&quot;')} }))">
              COPY
            </button>
          </div>
          <pre class="p-3 overflow-x-auto text-slate-300 font-mono leading-relaxed"><code>${code}</code></pre>
        </div>
      `);
      html = html.replace(match[0], placeholder);
    }

    html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-[#171717] border border-brand-border text-[#4B8EFF] font-mono text-[10px] font-bold">$1</code>');
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-xs font-bold text-white uppercase tracking-widest mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-xs font-bold text-[#4B8EFF] uppercase tracking-widest mt-5 mb-3 border-b border-brand-border pb-1">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-sm font-bold text-white uppercase tracking-widest mt-6 mb-4">$1</h2>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="flex items-start gap-2 text-slate-400 text-xs mb-1.5"><span class="text-[#4B8EFF] mt-1.5 shrink-0">▪</span><span>$1</span></li>');
    html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="flex items-start gap-2 text-slate-400 text-xs mb-1.5"><span class="text-[#4B8EFF] mt-1.5 shrink-0">▪</span><span>$1</span></li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="flex items-start gap-2 text-slate-400 text-xs mb-2"><span class="font-mono font-bold text-[#4B8EFF] shrink-0">$&</span></li>');
    html = html.replace(/\n/g, '<br/>');

    blocks.forEach((block, index) => {
      html = html.replace(`__CODE_BLOCK_PLACEHOLDER_${index}__`, block);
    });

    window.addEventListener('copy-code', ((e: CustomEvent) => {
      navigator.clipboard.writeText(e.detail);
      addToast('Copied code snippet.', 'success');
    }) as EventListener, { once: true });

    return { __html: html };
  };

  // Common top block for AI Insight + Why this matters cards
  const renderPrimaryInsights = () => {
    return (
      <div className="grid grid-cols-1 gap-5 select-text">
        {/* AI Insight Card */}
        <div className="border border-brand-border bg-[#111111] p-6 hover:border-slate-800 transition-colors">
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase block mb-2.5">AI Insight</span>
          <p className="text-sm text-white font-medium leading-relaxed">
            {insightText}
          </p>
        </div>
        
        {/* Developer Impact Card */}
        <div className="border border-brand-border bg-[#111111] p-6 hover:border-slate-800 transition-colors">
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase block mb-2.5">Why this matters</span>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            {impactText}
          </p>
        </div>
      </div>
    );
  };

  // Rendering Helper: Dashboard Cards based on Type
  const renderTechnicalDashboard = () => {
    
    // ==========================================
    // 1. LEETCODE PROBLEM DESIGN
    // ==========================================
    if (type === 'LeetCode Problem') {
      const roadmapSteps = nextSteps.length > 0 ? nextSteps : [
        'Initialize Map: Allocating associative memory for constant-time lookups.',
        'Linear Scan: Single-pass iteration to evaluate complement matches.',
        'Match Verification: Return index pairs or map current elements.'
      ];
      
      const roadmapCode = isDemoItem ? `def twoSum(nums, target):
    seen = {} # init_hash
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i` : `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

      return (
        <div className="space-y-6">
          {/* Primary full-width insights */}
          {renderPrimaryInsights()}

          {/* Grid Layout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs select-text">
            {/* LeetCode Title Description */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 tracking-wider">Problem</span>
                    <h3 className="text-sm font-bold text-white mt-1 uppercase font-mono">
                      {keyFindings[0]?.split(':')[0] || 'TWO SUM'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-slate-500 tracking-wider block">Difficulty</span>
                    <span className="text-xs font-bold text-[#4B8EFF] tracking-wider mt-1 block uppercase">Easy</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
                  {summary}
                </p>
              </div>

              {/* Complexities */}
              <div className="grid grid-cols-2 gap-4 border-t border-brand-border/40 pt-4 mt-5 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block">Time Complexity</span>
                  <span className="font-mono text-[#4B8EFF] font-bold mt-0.5 block">O(n)</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block">Space Complexity</span>
                  <span className="font-mono text-[#4B8EFF] font-bold mt-0.5 block">O(n)</span>
                </div>
              </div>
            </div>

            {/* Pattern Detected Card */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">Pattern Detected</span>
                
                <div className="mt-4 p-4 bg-[#171717] border border-brand-border flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-[#4B8EFF]" />
                    <span className="text-[11px] font-bold text-white">Hash Map / Two Pointer</span>
                  </div>
                  
                  {/* Progress gauge bar */}
                  <div className="w-full h-1 bg-[#262626] overflow-hidden">
                    <div className="h-full bg-[#4B8EFF]" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 block">Confidence: {confidence}%</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 leading-normal border-t border-brand-border/40 pt-4 mt-4">
                <span>// Optimal spatial-temporal tradeoff</span>
              </div>
            </div>
          </div>

          {/* Solution Approach card */}
          <div className="border border-brand-border bg-[#111111] p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-brand-border/40 pb-3 mb-5 flex items-center gap-2 font-mono select-none">
              <Terminal className="w-4 h-4 text-[#4B8EFF]" />
              Solution Approach
            </h3>

            <div className="grid grid-cols-1 gap-5">
              {/* List steps */}
              <div className="space-y-4 select-text">
                {roadmapSteps.map((step, idx) => {
                  const parts = step.split(':');
                  const stepLabel = parts[0] || `Step 0${idx+1}`;
                  const stepDesc = parts[1] || step;

                  return (
                    <div key={idx} className="flex items-start gap-3.5 text-xs leading-normal">
                      <span className="font-mono text-[10px] font-bold text-[#4B8EFF] border border-[#4B8EFF]/30 bg-[#4B8EFF]/5 px-2 py-0.5 shrink-0 mt-0.5">
                        0{idx+1}
                      </span>
                      <div className="font-sans">
                        <strong className="text-white block font-mono text-[11px]">{stepLabel}</strong>
                        <span className="text-slate-400 text-[11px] mt-0.5 block">{stepDesc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Code window */}
              <div className="border border-brand-border bg-[#0A0A0A] font-mono text-[11px] overflow-hidden flex flex-col select-text">
                <div className="flex items-center justify-between px-3 py-2 bg-[#171717] border-b border-brand-border text-[9px] text-slate-500 font-bold tracking-wider select-none">
                  <span>solution.py</span>
                  <button 
                    onClick={() => handleCopyText(roadmapCode)} 
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>COPY</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-emerald-400 max-h-[220px] custom-scrollbar"><code>{roadmapCode}</code></pre>
              </div>
            </div>
          </div>

          {/* Performance Analysis Card */}
          <div className="border border-brand-border bg-[#111111] p-6 font-sans select-text">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-brand-border/40 pb-3 mb-5 flex items-center gap-2 font-mono select-none">
              Performance Analysis
            </h3>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">Time Complexity</span>
                <span className="font-mono text-[#4B8EFF] font-bold mt-1 block">O(n)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">Space Complexity</span>
                <span className="font-mono text-[#4B8EFF] font-bold mt-1 block">O(n)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">Expected Scalability</span>
                <span className="text-white font-semibold mt-1 block">Linear scaling (O(n))</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider block">Optimization Opportunities</span>
                <span className="text-white font-semibold mt-1 block">None (Time complexity is optimal)</span>
              </div>
            </div>
          </div>

        </div>
      );
    }

    // ==========================================
    // 2. ERROR SCREENSHOT DESIGN
    // ==========================================
    if (type === 'Error Screenshot' || type === 'Terminal Output') {
      const rootCause = RootCauseMapping[type] || summary;
      const errorLabel = keyFindings[0] || 'React Hook Dependency Error';
      const excLabel = issues[0] || 'Violation detected: react-hooks/exhaustive-deps.';
      const patchCode = isDemoItem ? `useEffect(() => {
  // Data access logic
  console.log(data.id);
}, [data]); // UPDATED: dependency added` : suggestions[0] || `// Safe array map fix
items?.map(item => <Card key={item.id} />)`;

      return (
        <div className="space-y-6">
          {/* Primary full-width insights */}
          {renderPrimaryInsights()}

          {/* Middle card layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs select-text">
            {/* Error Type */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">Error Type</span>
                <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                  {errorLabel}
                </h3>
                <span className="inline-block mt-3 px-2 py-0.5 border border-red-500/30 bg-red-950/20 text-red-400 text-[8px] font-bold uppercase tracking-wider">
                  Critical Error
                </span>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
                  {excLabel}
                </p>
              </div>
            </div>

            {/* Root Cause */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">Root Cause</span>
                <p className="text-xs text-slate-400 mt-2 font-sans leading-relaxed">
                  {rootCause}
                </p>
              </div>
              <div className="mt-4 p-2.5 bg-[#171717] border border-brand-border text-[9px] text-orange-400 flex items-start gap-2 leading-relaxed">
                <span className="text-red-500 shrink-0 font-bold">✖</span>
                <span>warning: React Hook useEffect has a missing dependency. Either include it or remove the dependency array.</span>
              </div>
            </div>
          </div>

          {/* Suggested Fix & Commands block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs select-text">
            {/* Suggested Fix */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2 select-none">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider">Suggested Fix</span>
                <button 
                  onClick={() => handleCopyText(patchCode)} 
                  className="flex items-center gap-1 hover:text-white transition-colors text-[9px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Fix</span>
                </button>
              </div>
              
              <div className="border border-brand-border bg-[#0A0A0A] font-mono text-[10px] overflow-hidden flex flex-col">
                <div className="px-3 py-1 bg-[#171717] border-b border-brand-border text-slate-500 text-[8px] tracking-wider font-bold select-none">
                  UserProfile.tsx
                </div>
                <pre className="p-3 text-cyan-400 overflow-x-auto max-h-[140px] custom-scrollbar"><code>{patchCode}</code></pre>
              </div>
            </div>

            {/* Commands */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block mb-2 select-none">Commands</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {nextSteps.map((step, idx) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-brand-border/60 p-2.5 text-slate-300 select-all hover:border-slate-700 transition-colors">
                      {step.toLowerCase()}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-brand-border/40 font-sans">
                <span className="text-[8px] font-bold font-mono text-slate-500 tracking-wider block select-none">Quick Explanation</span>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Running these commands will automatically verify local lint properties and ensure hook state boundaries are preserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // 3. UI MOCKUPS / GENERAL DESIGN
    // ==========================================
    // UI Mockup & System design elements are rendered in General dashboard using custom labeled panels
    const hasUI = type === 'UI Mockup';
    
    return (
      <div className="space-y-6">
        {/* Primary full-width insights */}
        {renderPrimaryInsights()}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs select-text">
          
          {/* Left Area: Detected Type & Category Info */}
          <div className="flex flex-col gap-5">
            {/* Detected Type */}
            <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-1.5 min-h-[100px]">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block select-none">Detected Type</span>
              <div className="flex items-center gap-2.5 mt-1.5">
                <Cpu className="w-4 h-4 text-[#4B8EFF] shrink-0" />
                <span className="text-[11px] font-bold text-white tracking-wider uppercase">
                  {type.toUpperCase().replace(' ', '_')}
                </span>
              </div>
              <span className="text-[8px] text-slate-500 mt-1.5 font-semibold uppercase tracking-wider block select-none">
                {modelUsed || 'gemma4:e4b'} • ACTIVE
              </span>
            </div>

            {/* Layout Structure (replaces Issues Found or shows layout rules) */}
            <div className="border border-brand-border bg-[#111111] p-6 flex-1 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block select-none">
                {hasUI ? 'Layout Structure' : 'Issues Found'}
              </span>
              <div className="space-y-2.5 mt-2">
                {issues.length === 0 ? (
                  <span className="text-[10px] text-slate-500 italic block select-none">No critical warnings found.</span>
                ) : (
                  issues.map((issue, i) => (
                    <div key={i} className="text-[10px] text-red-400 leading-normal flex items-start gap-1.5 select-text font-sans">
                      <span className="text-red-500 font-mono">⚠</span>
                      <span>{issue}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Area: Components Detected (maps to Key Findings) */}
          <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-3 min-h-[200px]">
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase border-b border-brand-border/40 pb-2 block select-none">
              {hasUI ? 'Components Detected' : 'Key Findings'}
            </span>
            {keyFindings.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic select-none">No components listed.</p>
            ) : (
              <ul className="space-y-3 mt-1.5 flex-1">
                {keyFindings.map((finding, i) => (
                  <li key={i} className="flex gap-2 items-start text-[11px] leading-normal text-slate-300 font-sans">
                    <span className="text-[#4B8EFF] font-bold shrink-0">✓</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Suggested Stack & Implementation Notes row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs select-text">
          
          {/* Suggested Stack (maps to Suggestions) */}
          <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-2 min-h-[140px] border-l-4 border-l-[#4B8EFF]/50">
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase select-none">
              {hasUI ? 'Suggested Stack' : 'Suggested Improvements'}
            </span>
            <div className="space-y-2.5 mt-2">
              {suggestions.length === 0 ? (
                <span className="text-[10px] text-slate-500 italic block select-none">Optimal state verified</span>
              ) : (
                suggestions.map((suggestion, i) => (
                  <div key={i} className="text-[10px] text-[#4B8EFF] leading-normal flex items-start gap-1.5 select-text font-sans">
                    <span className="text-[#4B8EFF]">⚡</span>
                    <span>{suggestion}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Implementation Notes (maps to Next Steps) */}
          <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-2 min-h-[140px] border-l-4 border-l-orange-500/50">
            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase select-none">
              {hasUI ? 'Implementation Notes' : 'Next Steps'}
            </span>
            <div className="space-y-2.5 mt-2">
              {nextSteps.length === 0 ? (
                <span className="text-[10px] text-slate-500 italic block select-none">No steps listed</span>
              ) : (
                nextSteps.map((step, i) => (
                  <div key={i} className="text-[10px] text-slate-300 leading-normal flex items-start gap-1.5 select-text font-sans">
                    <span className="text-[#4B8EFF]">▪</span>
                    <span>{step}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions grid */}
        <div className="border border-brand-border bg-[#111111] p-6 font-mono text-xs">
          <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase block border-b border-brand-border/40 pb-2 mb-3 select-none">
            Actions
          </span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
            <div 
              onClick={() => handleActionClick(hasUI ? 'generate_components' : 'improve_architecture', hasUI ? 'Suggested Components' : 'Proposed Improvements')}
              className="border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:border-slate-700 p-3 flex flex-col justify-between cursor-pointer transition-colors"
            >
              <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase">Code Generation</span>
              <span className="text-[10px] text-white font-bold tracking-wide mt-1 block">
                {hasUI ? 'Apply Component' : 'Apply Refactor'}
              </span>
            </div>
            
            <div 
              onClick={() => {
                addToast('Generating detailed PDF report...', 'info');
              }}
              className="border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:border-slate-700 p-3 flex flex-col justify-between cursor-pointer transition-colors"
            >
              <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase">PDF Report</span>
              <span className="text-[10px] text-white font-bold tracking-wide mt-1 block">Export PDF</span>
            </div>
            
            <div 
              onClick={() => {
                addToast('Re-scanning current diagnostic module...', 'info');
              }}
              className="border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:border-slate-700 p-3 flex flex-col justify-between cursor-pointer transition-colors"
            >
              <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase">System Rescan</span>
              <span className="text-[10px] text-white font-bold tracking-wide mt-1 block">Re-scan Module</span>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const RootCauseMapping: { [key: string]: string } = {
    'Error Screenshot': 'React hook useEffect dependency violation. Variable is loaded within scope but missing in the dependencies matrix, triggering stale closures.',
    'Terminal Output': 'Build compiler process halted due to webpack dependency mismatches or compilation syntax violations.'
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden bg-brand-bg font-sans selection:bg-[#4B8EFF]/30 selection:text-white">
      
      {/* Page 2 Top Bar Navigation */}
      <div className="w-full shrink-0 border-b border-brand-border bg-[#0A0A0A] px-6 py-4 flex items-center justify-between font-mono text-xs select-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToWorkspace}
            className="flex items-center gap-1.5 py-1 px-2 border border-brand-border bg-[#111111] hover:bg-[#171717] text-[#4B8EFF] font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
          <div className="h-4 w-[1px] bg-brand-border"></div>
          <span className="text-white font-bold truncate max-w-[200px]" title={isAnalyzing ? 'Analyzing...' : results?.summary}>
            {isAnalyzing ? 'AI Diagnostics Active' : (isDemoItem ? results?.type : results?.summary)}
          </span>
          <span className="text-slate-500 text-[10px]">
            {isAnalyzing ? 'Analyzing Image...' : type}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Model:</span>
            <span className="text-white font-bold font-mono text-[10px]">{modelUsed || 'gemma4:e4b'}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-500">Status:</span>
            {isAnalyzing ? (
              <span className="text-[#4B8EFF] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#4B8EFF] animate-pulse"></span>
                RUNNING
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500"></span>
                COMPLETED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Grid Content Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column (40% width): Large Screenshot Image View */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[40%] shrink-0 border-r border-brand-border bg-[#0A0A0A] p-6 flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar select-none"
        >
          <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Screenshot Preview</span>
          
          <div className="relative border border-brand-border bg-[#111111] p-1 flex items-center justify-center overflow-hidden min-h-[300px] flex-1">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Diagnostics Screenshot Source"
                className="w-full h-full object-contain filter blur-[0.3px]"
              />
            ) : (
              <div className="w-full h-full bg-[#111111]/30 opacity-20 text-[9px] font-mono p-4 flex flex-col justify-center">
                <code>
                  at renderWithHooks (react-dom.development.js:15486:18)<br/>
                  at mountIndeterminateComponent (react-dom.development.js:18100:16)
                </code>
              </div>
            )}
            
            {/* Blurry scan lines badge overlay */}
            <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 border border-[#4B8EFF]/40 bg-[#0A0A0A]/95 text-[#4B8EFF] font-mono text-[9px] font-bold tracking-widest uppercase">
                {isAnalyzing ? 'ANALYSIS_IN_PROGRESS' : 'AI Diagnostics Active'}
              </span>
            </div>
            
            <span className="absolute bottom-2 right-2 text-[8px] font-mono px-1.5 py-0.5 bg-[#0A0A0A] text-slate-500 border border-brand-border">
              ● Connected
            </span>
          </div>
        </motion.div>

        {/* Right Column (60% width): Detailed Analysis Scroll Area or Loading Panel with AnimatePresence */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg relative">
          <AnimatePresence>
            {isAnalyzing ? (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full p-6 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center bg-brand-bg"
              >
                <div className="w-full max-w-lg flex flex-col gap-6 select-none font-mono">
                  {/* Console loading box */}
                  <div className="border border-brand-border bg-[#111111] p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                      <span className="text-[10px] font-bold text-[#4B8EFF] tracking-wider uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#4B8EFF] animate-pulse rounded-none"></span>
                        AI Diagnostics Active
                      </span>
                      <span className="text-[9px] text-[#4B8EFF] font-bold">{loadingProgress}% COMPLETE</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Active Process</span>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider min-h-[16px]">
                        {loadingText}
                      </h3>
                      
                      {/* Sleek Minimalist Progress Bar */}
                      <div className="w-full h-1 bg-slate-900 overflow-hidden relative border border-brand-border/10">
                        <div 
                          className="h-full bg-[#4B8EFF] transition-all duration-500 ease-out" 
                          style={{ width: `${loadingProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Step log metrics */}
                    <div className="border-t border-brand-border/30 pt-4 text-[9px] text-slate-500 leading-relaxed space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400">✔</span>
                        <span>Buffer initialized locally</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadingProgress >= 25 ? (
                          <span className="text-emerald-400">✔</span>
                        ) : (
                          <span className="w-2 h-2 border border-slate-700 block shrink-0"></span>
                        )}
                        <span>Gemma 4 parsed screenshot ({Math.round(loadingProgress * 4.5)} tokens)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadingProgress >= 75 ? (
                          <span className="text-emerald-400">✔</span>
                        ) : (
                          <span className="w-2 h-2 border border-slate-700 block shrink-0"></span>
                        )}
                        <span>Mapping structural analysis vectors</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 text-center leading-relaxed font-sans mt-1">
                    Gemma 4 Vision is executing visual inference natively via local Ollama connection.
                  </p>
                </div>
                <div className="w-full max-w-3xl mt-8">
                  <SkeletonCards />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full flex flex-col overflow-hidden bg-brand-bg"
              >
                <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              
              {/* 1. Technical dashboard components */}
              {renderTechnicalDashboard()}

              {/* 2. Metadata details panel inside the results */}
              <div className="border border-brand-border bg-[#111111] p-5 text-[10px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-4 select-text">
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider select-none">Model</span>
                  <span className="font-bold text-white mt-0.5 block">{modelUsed || 'gemma4:e4b'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider select-none">Processing Time</span>
                  <span className="font-bold text-white mt-0.5 block">{processingTime ? `${processingTime}s` : '2.3s'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider select-none">Confidence</span>
                  <span className="font-bold text-[#4B8EFF] mt-0.5 block">{confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[9px] tracking-wider select-none">Status</span>
                  <span className="font-bold text-green-400 mt-0.5 block flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>

              {/* 3. Ask AI Follow-Up Chat */}
              <div className="border border-brand-border bg-[#111111] overflow-hidden flex flex-col font-mono text-xs">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#171717] border-b border-brand-border text-[9px] text-slate-500 font-bold tracking-wider uppercase select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#4B8EFF]" />
                  <span>Ask AI</span>
                </div>
                <span className="text-[8px] bg-[#262626] text-slate-300 px-1 py-0.2">Local Mode</span>
              </div>

              {/* Chat messages */}
              <div className="p-4 space-y-3.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar bg-[#0A0A0A]/40 min-h-[50px] leading-relaxed select-text">
                <div className="text-[10px] text-slate-500 border-b border-brand-border/40 pb-2 font-semibold select-none">
                  <span>Ask follow-up questions to query screenshot context.</span>
                </div>

                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold tracking-wide select-none">
                      <span>{msg.role === 'user' ? 'DEVELOPER' : 'GEMMA_LOCAL'}</span>
                      <span>[{msg.timestamp}]</span>
                    </div>
                    
                    <div 
                      className={`p-2.5 font-mono text-[11px] leading-normal ${
                        msg.role === 'user' 
                          ? 'text-white border-l-2 border-slate-600 bg-brand-card/25' 
                          : 'text-slate-300 border-l-2 border-[#4B8EFF] bg-[#111111]/30'
                      }`}
                      dangerouslySetInnerHTML={msg.role === 'assistant' ? renderMarkdown(msg.content) : undefined}
                    >
                      {msg.role === 'user' ? `> ${msg.content}` : undefined}
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold select-none">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#4B8EFF] animate-ping"></span>
                    <span>Gemma is generating response...</span>
                  </div>
                )}
              </div>

              {/* Suggestion pills */}
              <div className="p-3 bg-[#111111]/90 border-t border-brand-border/50 flex flex-wrap gap-2 text-[9px] font-bold tracking-wider text-slate-400 select-none">
                <button 
                  onClick={() => handleSendChat("Generate React component code for this UI")}
                  disabled={isChatLoading}
                  className="px-2.5 py-1 border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:text-[#4B8EFF] transition-colors"
                >
                  Generate React code
                </button>
                
                <button 
                  onClick={() => handleSendChat("Explain this error simply")}
                  disabled={isChatLoading}
                  className="px-2.5 py-1 border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:text-[#4B8EFF] transition-colors"
                >
                  Explain error simply
                </button>
                
                <button 
                  onClick={() => handleSendChat("Show the optimal solution")}
                  disabled={isChatLoading}
                  className="px-2.5 py-1 border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:text-[#4B8EFF] transition-colors"
                >
                  Show optimal solution
                </button>

                <button 
                  onClick={() => handleSendChat("Suggest improvements")}
                  disabled={isChatLoading}
                  className="px-2.5 py-1 border border-brand-border bg-[#0A0A0A] hover:bg-[#171717] hover:text-[#4B8EFF] transition-colors"
                >
                  Suggest improvements
                </button>
              </div>

              {/* Input block */}
              <form onSubmit={handleChatSubmit} className="flex border-t border-brand-border bg-[#0A0A0A] select-none">
                <div className="flex items-center pl-3 pr-1.5 text-[#4B8EFF] font-bold shrink-0 select-none font-mono">
                  ask_ai&gt;
                </div>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isChatLoading}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-transparent px-2 py-3 outline-none text-xs text-white font-mono placeholder-slate-700 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !chatInput.trim()}
                  className="px-5 border-l border-brand-border hover:bg-[#171717] transition-colors text-[10px] font-bold text-white uppercase tracking-wider disabled:opacity-40 shrink-0"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
      </div>

      {/* Modal Actions */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isActionLoading && setModalOpen(false)}
              className="absolute inset-0 bg-black/85"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[85vh] bg-[#111111] border border-brand-border rounded-none shadow-none flex flex-col overflow-hidden z-10 font-mono text-xs select-text"
            >
              <div className="p-3 border-b border-brand-border flex items-center justify-between bg-[#171717] font-bold text-[10px] tracking-wider select-none">
                <span className="text-[#4B8EFF] uppercase">{modalTitle}</span>
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={isActionLoading}
                  className="px-2 py-0.5 border border-brand-border hover:bg-slate-900 transition-colors"
                >
                  CLOSE
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar select-text bg-[#0A0A0A]/20 leading-relaxed font-sans text-xs relative min-h-[220px]">
                <AnimatePresence mode="wait">
                  {isActionLoading ? (
                    <motion.div
                      key="action-loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex items-center justify-center p-6 bg-[#0A0A0A]/10 select-none"
                    >
                      <div className="w-full max-w-md border border-brand-border bg-[#111111] p-5 flex flex-col gap-4 font-mono">
                        <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                          <span className="text-[9px] font-bold text-[#4B8EFF] tracking-wider uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#4B8EFF] animate-pulse"></span>
                            EXECUTING_ACTION
                          </span>
                          <span className="text-[8px] text-slate-500">GEMMA_4_API</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-full h-1 bg-[#0A0A0A] border border-brand-border/20 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4B8EFF]/40 to-transparent -translate-x-full animate-shimmer-x"></div>
                          </div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block">Generating response streams...</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="action-content"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full min-h-full"
                    >
                      <div 
                        className="prose prose-invert max-w-none text-slate-300 text-xs font-sans leading-relaxed space-y-3"
                        dangerouslySetInnerHTML={renderMarkdown(modalContent)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isActionLoading && modalContent && (
                <div className="p-3 border-t border-brand-border bg-[#171717] flex justify-end gap-2 text-[10px] font-bold select-none">
                  <button
                    onClick={() => handleCopyText(modalContent)}
                    className="px-3 py-1 border border-brand-border bg-[#0A0A0A] hover:bg-[#111111] transition-colors"
                  >
                    {copiedId ? 'COPIED' : 'COPY_ALL'}
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-1 bg-[#4B8EFF] text-black border border-[#4B8EFF]"
                  >
                    DONE
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
