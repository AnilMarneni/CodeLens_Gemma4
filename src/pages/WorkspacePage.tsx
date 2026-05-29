import React, { useState, useEffect, useRef } from 'react';
import { ResultsPanel } from '../components/ResultsPanel';
import { Toast, ToastMessage } from '../components/Toast';
import { Sidebar } from '../components/Sidebar';
import { ApiService } from '../services/api';
import { AnalysisResult, HistoryItem, ActionResult } from '../types/index';
import { demoItems, DemoItem } from '../utils/demoData';
import { Cpu, Upload, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspacePageProps {
  history: HistoryItem[];
  imagesAnalyzed: number;
  addToHistory: (
    imageName: string,
    imageSize: string,
    imageType: string,
    imageUrl: string,
    results: AnalysisResult
  ) => HistoryItem;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  shouldFocusSamples: boolean;
  onResetFocusSamples: () => void;
}

const LOADING_STATUSES = [
  'Analyzing visual content...',
  'Identifying screenshot type...',
  'Generating developer insights...',
  'Preparing recommendations...'
];

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  history,
  addToHistory,
  removeFromHistory,
  clearHistory,
  shouldFocusSamples,
  onResetFocusSamples,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STATUSES[0]);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeDemoItem, setActiveDemoItem] = useState<DemoItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'workspace' | 'history' | 'samples'>('workspace');
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Section refs for scroll behavior
  const uploaderRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const samplesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states for config/docs
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'config' | 'docs' | null>(null);

  // Toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Scroll navigation helper
  const scrollToSection = (tab: 'workspace' | 'history' | 'samples') => {
    setActiveTab(tab);
    if (tab === 'workspace') {
      uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'history') {
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'samples') {
      samplesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Focus sample gallery if requested by CTA
  useEffect(() => {
    if (shouldFocusSamples) {
      setTimeout(() => {
        scrollToSection('samples');
        addToast('Use the "Sample Analyses" list for quick offline testing!', 'info');
        onResetFocusSamples();
      }, 100);
    }
  }, [shouldFocusSamples, onResetFocusSamples]);

  // Loading progress & text cycling effect
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let intervalId: any;
    if (isAnalyzing) {
      setLoadingProgress(15);
      setLoadingText(LOADING_STATUSES[0]);
      
      let index = 0;
      intervalId = setInterval(() => {
        index++;
        if (index < LOADING_STATUSES.length) {
          setLoadingText(LOADING_STATUSES[index]);
          const progressSteps = [25, 50, 75, 90];
          setLoadingProgress(progressSteps[index]);
        }
      }, 1600);
    } else {
      setLoadingProgress(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAnalyzing]);

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const validateAndProcessFile = (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      addToast('MIME type not supported. Only PNG, JPG, or JPEG allowed.', 'error');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      addToast('File size exceeded. Maximum limit is 10MB.', 'error');
      return;
    }

    handleImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleAreaClick = () => {
    if (!isAnalyzing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle local file selection
  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    setIsDemoMode(false);
    setActiveDemoItem(null);
    setResults(null);
    setSelectedHistoryId(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove preview
  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setSelectedHistoryId(null);
    setIsDemoMode(false);
    setActiveDemoItem(null);
  };

  // Back navigation handler
  const handleBackToWorkspace = () => {
    setResults(null);
    setIsDemoMode(false);
    setActiveDemoItem(null);
    setSelectedHistoryId(null);
  };

  // Run initial AI analysis
  const handleTriggerAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      // Execute API request
      const analysis = await ApiService.analyzeImage(selectedFile);
      
      // Save result into local cache
      const sizeStr = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;
      const newItem = addToHistory(
        selectedFile.name,
        sizeStr,
        selectedFile.type,
        previewUrl || '',
        analysis
      );

      setResults(analysis);
      setSelectedHistoryId(newItem.id);
      addToast('Analysis completed successfully!', 'success');
    } catch (e: any) {
      console.error(e);
      addToast(e.message || 'AI Analysis failed. Make sure Ollama server is running.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Example Gallery select (Demo Mode)
  const handleSelectDemo = (demo: DemoItem) => {
    setIsDemoMode(true);
    setActiveDemoItem(demo);
    setResults(null);
    setSelectedHistoryId(null);
    
    // Set preview URL to SVG
    setPreviewUrl(demo.imageUrl);
    // Create dummy File
    const dummyFile = new File(['demo'], `${demo.name.toLowerCase().replace(/\s+/g, '_')}_mock.png`, {
      type: 'image/png',
    });
    setSelectedFile(dummyFile);

    // Trigger artificial loading delay (6.5s) to experience rotating text loading screens and progress bar transitions
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults(demo.analysis);
      
      // Add to sidebar cache so user can browse/delete mock results normally
      const newItem = addToHistory(
        `${demo.name} (Sample)`,
        '45 KB',
        'image/png',
        demo.imageUrl,
        demo.analysis
      );
      setSelectedHistoryId(newItem.id);
      addToast(`Loaded ${demo.name} sample database successfully!`, 'success');
    }, 6500);
  };

  // Handle Sidebar item select
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedHistoryId(item.id);
    setResults(item.results);
    setPreviewUrl(item.imageUrl);
    setIsDemoMode(item.id.includes('demo-') || item.id.includes('_001_') || item.imageName.includes('(Sample)'));
    
    // If it is a sample, map the matching demo item for contextual actions
    if (item.imageName.includes('(Sample)')) {
      const match = item.imageName.replace(' (Sample)', '');
      // Find matching demo
      const found = demoItems.find(d => d.name === match);
      if (found) {
        setActiveDemoItem(found);
        setIsDemoMode(true);
      }
    } else {
      setActiveDemoItem(null);
    }

    // Set placeholder file
    const file = new File(['cached'], item.imageName, { type: item.imageType });
    setSelectedFile(file);
  };

  // Contextual AI Actions handler
  const handleExecuteAction = async (actionKey: string): Promise<ActionResult> => {
    if (isDemoMode && activeDemoItem) {
      // Mock action results offline
      return new Promise<ActionResult>((resolve, reject) => {
        setTimeout(() => {
          const actionResult = activeDemoItem.actions[actionKey];
          if (actionResult) {
            resolve(actionResult);
          } else {
            reject(new Error(`Action '${actionKey}' is not pre-cached in Sandbox.`));
          }
        }, 1200); // Artificial processing delay
      });
    }

    // Real API call to Ollama backend
    if (!selectedFile || !previewUrl) {
      throw new Error('Image reference lost. Please re-upload.');
    }
    
    return ApiService.executeAction(
      results?.type || 'Other',
      actionKey,
      previewUrl // Send base64 image data
    );
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden bg-brand-bg relative">
      <AnimatePresence mode="wait">
        {results || isAnalyzing ? (
          <motion.div
            key="analysis-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col h-full w-full overflow-hidden"
          >
            <ResultsPanel
              results={results}
              isAnalyzing={isAnalyzing}
              loadingText={loadingText}
              loadingProgress={loadingProgress}
              isDemoItem={isDemoMode}
              onExecuteAction={handleExecuteAction}
              addToast={addToast}
              imageUrl={previewUrl}
              onBackToWorkspace={handleBackToWorkspace}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex flex-col lg:flex-row h-full w-full overflow-hidden"
          >
            {/* Sidebar Cache Panel */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={scrollToSection}
              onConfigClick={() => {
                setModalTitle('System Configuration');
                setModalType('config');
                setModalOpen(true);
              }}
              onDocsClick={() => {
                setModalTitle('API Reference & Documentation');
                setModalType('docs');
                setModalOpen(true);
              }}
            />

            {/* Main Workspace Frame */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-brand-bg relative scroll-smooth custom-scrollbar">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col p-6 lg:p-8 gap-8 select-none">
                
                {/* Header */}
                <div className="border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-text">
                  <div>
                    <span className="text-[10px] font-bold text-[#4B8EFF] font-mono tracking-wider uppercase">WORKSPACE SOURCE // LOCAL_HOST</span>
                    <h1 className="text-lg font-bold text-white tracking-wide mt-1 font-mono">DEVELOPER INTELLIGENCE PLATFORM</h1>
                  </div>
                  
                  <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 bg-[#111111] px-3 py-1.5 border border-brand-border">
                    <span>ACTIVE MODEL:</span>
                    <span className="text-white font-bold">gemma4:e4b</span>
                  </div>
                </div>

                {/* Row 1: Uploader and AI Engine Status Card */}
                <div ref={uploaderRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-6">
                  {/* Uploader Column (2/3 width) */}
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Screenshot Upload Zone</span>
                    
                    {!selectedFile ? (
                      /* Drag & Drop Box */
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={handleAreaClick}
                        className={`flex flex-col items-center justify-center border border-dashed p-10 text-center cursor-pointer min-h-[260px] transition-colors duration-150 ${
                          isDragActive
                            ? 'border-[#4B8EFF] bg-[#4B8EFF]/5'
                            : 'border-brand-border bg-[#111111] hover:bg-[#171717]'
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center border border-brand-border bg-[#0A0A0A] text-[#4B8EFF] mb-4">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-350 tracking-wider font-mono">DROP DEVELOPER SCREENSHOT HERE</span>
                        <p className="text-[11px] text-slate-500 mt-2 max-w-[280px] leading-relaxed font-sans">
                          Click to browse or drop PNG or JPG files here (Max 10MB).
                        </p>
                        
                        {/* Supported badges */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
                          {['Errors', 'Code Snippets', 'LeetCode', 'Mockups', 'System Design'].map((badge) => (
                            <span key={badge} className="text-[8px] font-bold font-mono px-2 py-0.5 border border-brand-border bg-[#0A0A0A] text-slate-400">
                              {badge.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Selected File / Preview Box */
                      <div className="border border-brand-border bg-[#111111] p-4 flex flex-col md:flex-row gap-6 min-h-[260px]">
                        {/* Visual Preview on Left */}
                        <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto md:h-full min-h-[160px] border border-brand-border bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Upload Preview"
                              className="w-full h-full object-contain"
                            />
                          )}
                          
                          {/* Remove image button */}
                          <button
                            onClick={handleRemoveSelected}
                            className="absolute top-2 right-2 p-1.5 bg-[#0A0A0A]/95 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-brand-border transition-colors"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* File Metadata & Trigger on Right */}
                        <div className="flex-1 flex flex-col justify-between py-2 font-mono">
                          <div className="space-y-4">
                            <div>
                              <span className="text-[9px] text-slate-500 font-bold block">FILE NAME</span>
                              <span className="text-xs font-bold text-white break-all mt-0.5 block">{selectedFile.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-[9px] text-slate-500 font-bold block">FILE SIZE</span>
                                <span className="text-xs font-bold text-slate-300 mt-0.5 block">{formatBytes(selectedFile.size)}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-slate-500 font-bold block">FORMAT</span>
                                <span className="text-xs font-bold text-slate-300 mt-0.5 block">{selectedFile.type || 'image/png'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleTriggerAnalyze}
                            className="w-full mt-6 py-3 bg-[#4B8EFF] text-black font-extrabold text-xs tracking-widest hover:bg-[#3b7edf] transition-all flex items-center justify-center gap-2"
                          >
                            <Cpu className="w-4 h-4" />
                            <span>RUN DIAGNOSTIC ENGINE</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Engine Status Card Column (1/3 width) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Local Engine Status</span>
                    
                    <div className="border border-brand-border bg-[#111111] p-5 flex-1 flex flex-col justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-brand-border pb-2.5">
                          <Cpu className="w-4 h-4 text-[#4B8EFF]" />
                          <span className="text-xs font-bold font-mono text-white tracking-wider">OLLAMA GATEWAY</span>
                        </div>
                        
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Target Model:</span>
                            <span className="font-mono text-white font-bold text-[11px]">gemma4:e4b</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Context Limit:</span>
                            <span className="text-slate-300 font-semibold font-mono">8192 tokens</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Endpoint Type:</span>
                            <span className="text-slate-300 font-semibold font-mono">Local Host (11434)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Status Check:</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Connected
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-brand-border/40 pt-4 text-[10px] font-mono text-slate-500 leading-relaxed font-sans">
                        The local neural pipeline reads raw canvas buffer tokens synchronously, executing structured JSON classification without any external internet telemetry.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Recent Analyses */}
                <div ref={historyRef} className="flex flex-col gap-3 scroll-mt-6">
                  <div className="border-b border-brand-border pb-2 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Recent Analyses</span>
                    {history.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="text-[9px] font-bold text-slate-500 hover:text-red-400 font-mono transition-colors uppercase border border-brand-border px-2 py-0.5 bg-[#111111]"
                      >
                        Clear Log
                      </button>
                    )}
                  </div>
                  
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-brand-border bg-[#111111]/30">
                      <span className="text-xs text-slate-500 font-mono">No recent analyses in local session cache.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {history.map((item) => {
                        const itemLabel = item.imageName.replace(' (Sample)', '');
                        const isSelected = item.id === selectedHistoryId;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelectHistoryItem(item)}
                            className={`group relative flex flex-col border bg-[#111111] hover:border-slate-700 cursor-pointer transition-all ${
                              isSelected ? 'border-[#4B8EFF]' : 'border-brand-border'
                            }`}
                          >
                            {/* Image Thumbnail Container */}
                            <div className="aspect-video w-full border-b border-brand-border bg-slate-950 overflow-hidden flex items-center justify-center">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.imageName}
                                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#0A0A0A]" />
                              )}
                            </div>
                            
                            {/* Metadata below image */}
                            <div className="p-3 font-mono">
                              <h4 className="text-xs font-bold text-white truncate max-w-full">
                                {itemLabel}
                              </h4>
                              <div className="flex items-center justify-between mt-1 text-[9px]">
                                <span className="text-[#4B8EFF] font-bold uppercase">
                                  {item.results.type.replace(' Screenshot', '').replace(' Problem', '')}
                                </span>
                                <span className="text-slate-500 font-semibold">
                                  {item.imageSize}
                                </span>
                              </div>
                            </div>
                            
                            {/* Floating hover delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromHistory(item.id);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-[#0A0A0A]/90 text-slate-500 hover:text-red-400 border border-brand-border opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Row 3: Sample Analyses */}
                <div ref={samplesRef} className="flex flex-col gap-3 scroll-mt-6 pb-8">
                  <div className="border-b border-brand-border pb-2">
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">Sample Analyses (Offline Sandbox)</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {demoItems.map((demo) => {
                      return (
                        <div
                          key={demo.id}
                          onClick={() => handleSelectDemo(demo)}
                          className="group flex flex-col border border-brand-border bg-[#111111] hover:border-slate-700 cursor-pointer transition-all"
                        >
                          {/* SVG Image Thumbnail */}
                          <div className="aspect-video w-full border-b border-brand-border bg-slate-950 overflow-hidden flex items-center justify-center">
                            <img
                              src={demo.imageUrl}
                              alt={demo.name}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                            />
                          </div>
                          
                          {/* Details */}
                          <div className="p-3 font-mono">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white truncate max-w-full">
                                {demo.id}
                              </h4>
                              <span className="text-[8px] font-bold bg-[#1A1A1A] border border-brand-border px-1 text-slate-400">
                                SAMPLE
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-1 text-[9px]">
                              <span className="text-[#4B8EFF] font-bold uppercase">
                                {demo.category}
                              </span>
                              <span className="text-slate-500 font-semibold">
                                45 KB
                              </span>
                            </div>
                            <p className="text-[10px] font-sans text-slate-500 leading-snug mt-2 line-clamp-2">
                              {demo.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Toast Alerts */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* Workspace Modals (Config & Docs API) */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/85"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[80vh] bg-[#111111] border border-brand-border rounded-none shadow-none flex flex-col overflow-hidden z-10 font-mono text-xs select-text"
            >
              {/* Modal Header */}
              <div className="p-3 border-b border-brand-border flex items-center justify-between bg-[#171717] font-bold text-[10px] tracking-wider select-none">
                <span className="text-[#4B8EFF] uppercase">{modalTitle}</span>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-2 py-0.5 border border-brand-border hover:bg-slate-900 transition-colors"
                >
                  CLOSE
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar select-text bg-[#0A0A0A]/20 leading-relaxed font-sans text-xs">
                {modalType === 'config' ? (
                  <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-300">
                    <p>Configure local AI engine endpoints and manage session caches.</p>
                    
                    <div className="border border-brand-border bg-[#0A0A0A] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">AI Model Target:</span>
                        <span className="font-bold text-white">gemma4:e4b (Gemma 4 Vision)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Local Runtime:</span>
                        <span className="font-bold text-white">Ollama</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Ollama Host Connection:</span>
                        <span className="font-bold text-[#4B8EFF]">http://localhost:11434</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">API Gateway Endpoint:</span>
                        <span className="font-bold text-[#4B8EFF]">http://localhost:5000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Workspace Status:</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Connected & Active
                        </span>
                      </div>
                    </div>

                    <div className="border border-brand-border bg-[#111111] p-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">Cache Management</span>
                      <p className="text-[11px] text-slate-500 font-sans">
                        The local session cache holds analyzed records and statistics. Clearing the cache will reset your analyzed metric counts.
                      </p>
                      <div className="pt-2 flex justify-between items-center select-none">
                        <span className="text-slate-400">Total Analyses Cache: {history.length} items</span>
                        <button
                          onClick={() => {
                            clearHistory();
                            setModalOpen(false);
                            addToast('Local session cache has been reset.', 'success');
                          }}
                          className="px-3 py-1.5 border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/40 transition-colors font-bold uppercase tracking-wider text-[10px]"
                        >
                          Clear Cache
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-300">
                    <p>Developer Reference Manual and Integration Guidelines for CodeLens AI.</p>
                    
                    <div className="border border-[#262626] bg-[#0A0A0A] p-4">
                      <h4 className="text-[#4B8EFF] font-bold uppercase text-[10px] tracking-wider mb-2 select-none">Endpoint 1: Analyze Screenshot</h4>
                      <p className="text-[11px] text-slate-400 font-sans mb-2">
                        Classifies screenshot content and performs structural analysis.
                      </p>
                      <div className="bg-[#111111] p-2 text-[10px] text-slate-300 border border-brand-border mb-3 select-all">
                        POST /api/analyze
                      </div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1 select-none">CURL Query</span>
                      <pre className="bg-[#111111] p-3 text-[10px] text-emerald-400 border border-brand-border select-all overflow-x-auto">
{`curl -X POST -F "image=@/path/to/screenshot.png" \\
  http://localhost:5000/api/analyze`}
                      </pre>
                    </div>

                    <div className="border border-[#262626] bg-[#0A0A0A] p-4">
                      <h4 className="text-[#4B8EFF] font-bold uppercase text-[10px] tracking-wider mb-2 select-none">Endpoint 2: Contextual AI Actions</h4>
                      <p className="text-[11px] text-slate-400 font-sans mb-2">
                        Executes follow-up requests or processes conversational "Ask AI" queries.
                      </p>
                      <div className="bg-[#111111] p-2 text-[10px] text-slate-300 border border-brand-border mb-3 select-all">
                        POST /api/action
                      </div>
                      <span className="text-slate-500 text-[10px] uppercase font-bold block mb-1 select-none">Payload Schema</span>
                      <pre className="bg-[#111111] p-3 text-[10px] text-emerald-400 border border-brand-border select-all overflow-x-auto">
{`{
  "analysisType": "Error Screenshot",
  "action": "Generate suggested component code",
  "image": "data:image/png;base64,iVBORw0KG..."
}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-brand-border bg-[#171717] flex justify-end select-none">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-1.5 bg-[#4B8EFF] text-black font-bold uppercase tracking-wider text-[10px]"
                >
                  DONE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
