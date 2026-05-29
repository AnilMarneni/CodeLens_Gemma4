import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, Cpu } from 'lucide-react';
import { demoItems, DemoItem } from '../utils/demoData';
import { HistoryItem } from '../types/index';

interface UploadPanelProps {
  selectedFile: File | null;
  previewUrl: string | null;
  onImageSelected: (file: File) => void;
  onRemoveSelected: () => void;
  onTriggerAnalyze: () => void;
  onSelectDemo: (demo: DemoItem) => void;
  isAnalyzing: boolean;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  // Navigation & History states
  activeTab: 'history' | 'samples';
  history: HistoryItem[];
  selectedHistoryId: string | null;
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  selectedFile,
  previewUrl,
  onImageSelected,
  onRemoveSelected,
  onTriggerAnalyze,
  onSelectDemo,
  isAnalyzing,
  addToast,
  activeTab,
  history,
  selectedHistoryId,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Validate and process selected files
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

    onImageSelected(file);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Handle input file select
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

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 p-4 border-r border-brand-border bg-[#0A0A0A] shrink-0 h-full overflow-y-auto font-mono custom-scrollbar">
      
      {/* 1. SECTION LABEL */}
      <div className="border-b border-brand-border pb-2.5 shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider">WORKSPACE SOURCE</span>
        <span className="text-[9px] text-[#4B8EFF] font-bold">VITE_DEV_DEV</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
        disabled={isAnalyzing}
      />

      {/* 2. Drag & Drop / Preview Box */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleAreaClick}
          className={`flex flex-col items-center justify-center border border-dashed p-5 text-center cursor-pointer min-h-[170px] transition-colors duration-150 ${
            isDragActive
              ? 'border-[#4B8EFF] bg-[#4B8EFF]/5'
              : 'border-brand-border bg-[#111111] hover:bg-[#171717]'
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center border border-brand-border bg-[#0A0A0A] text-[#4B8EFF] mb-3">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-300">Upload Screenshot</span>
          <p className="text-[9px] text-slate-500 mt-1 max-w-[200px] leading-relaxed font-sans">
            Select a screenshot file or drag it here (PNG, JPG, max 10MB)
          </p>
        </div>
      ) : (
        /* Image Preview Box */
        <div className="border border-brand-border bg-[#111111] p-3 flex flex-col gap-3">
          <div className="relative aspect-video w-full border border-brand-border bg-[#0A0A0A] flex items-center justify-center overflow-hidden">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Upload Preview"
                className="w-full h-full object-contain"
              />
            )}
            
            <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 bg-[#0A0A0A]/95 text-slate-300 border border-brand-border">
              {selectedFile.name.length > 20 ? `${selectedFile.name.slice(0, 17)}...` : selectedFile.name}
            </span>

            {/* Remove Button */}
            {!isAnalyzing && (
              <button
                onClick={onRemoveSelected}
                className="absolute top-1.5 right-1.5 p-1 bg-[#0A0A0A]/85 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-brand-border transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-brand-border/40 pb-2">
            <span className="truncate max-w-[125px] font-bold text-slate-400">
              {selectedFile.name}
            </span>
            <span className="font-semibold">
              {formatBytes(selectedFile.size)}
            </span>
          </div>

          <button
            onClick={onTriggerAnalyze}
            disabled={isAnalyzing}
            className={`w-full flex items-center justify-center gap-1.5 py-2 font-bold text-[10px] tracking-wider transition-colors ${
              isAnalyzing
                ? 'bg-brand-border text-slate-500 cursor-not-allowed border border-brand-border'
                : 'bg-transparent text-white border border-[#4B8EFF]/60 hover:bg-[#4B8EFF]/10 active:bg-[#4B8EFF]/20'
            }`}
          >
            <span>{isAnalyzing ? 'Analyzing Screenshot...' : 'Run Analysis'}</span>
          </button>
        </div>
      )}

      {/* 3. Local AI Engine Panel */}
      <div className="border border-brand-border bg-[#111111] p-3 flex flex-col gap-1.5 shrink-0 font-sans">
        <div className="flex items-center gap-2 border-b border-brand-border/45 pb-1">
          <Cpu className="w-3.5 h-3.5 text-[#4B8EFF]" />
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">AI Engine</span>
        </div>
        <div className="flex flex-col text-[11px] leading-normal font-medium text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Model:</span>
            <span className="font-mono text-[10px] font-bold text-white">Gemma 4 Vision</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-slate-500">Runtime:</span>
            <span className="text-white font-semibold">Running Locally</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* 4. Lists Container */}
      <div className="flex-1 flex flex-col min-h-0 mt-1">
        {activeTab === 'history' ? (
          /* Recent Analyses List */
          <div className="flex flex-col flex-1 min-h-0">
            <div className="border-b border-brand-border pb-1.5 mb-2.5 flex justify-between items-center shrink-0">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">Recent Analyses</span>
              {history.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-[8px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase"
                  title="Clear history log"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-brand-border/60">
                  <span className="text-[9px] text-slate-500">No recent analyses</span>
                </div>
              ) : (
                history.map((item) => {
                  const isSelected = item.id === selectedHistoryId;
                  const itemLabel = item.imageName.replace(' (Sample)', '');
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`group relative flex items-center gap-2.5 p-2 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#171717] border-[#4B8EFF] text-white'
                          : 'bg-[#111111]/45 border-brand-border text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {/* Real Image Thumbnail */}
                      <div className="w-10 h-7 border border-brand-border/60 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.imageName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#171717]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className="text-[10px] font-bold text-white tracking-wide truncate">
                          {itemLabel}
                        </h4>
                        <span className="text-[8px] text-slate-500 font-semibold tracking-wider uppercase block truncate">
                          {item.results.type.replace(' Screenshot', '').replace(' Problem', '')}
                        </span>
                      </div>

                      {/* Delete icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteItem(item.id);
                        }}
                        className="absolute right-1 top-2.5 p-1 rounded hover:bg-red-950/20 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete log"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* Sample Analyses List */
          <div className="flex flex-col flex-1 min-h-0">
            <div className="border-b border-brand-border pb-1.5 mb-2.5 shrink-0">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider">Sample Analyses</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {demoItems.map((demo) => {
                const isSelected = demo.id === selectedHistoryId;
                
                return (
                  <div
                    key={demo.id}
                    onClick={() => !isAnalyzing && onSelectDemo(demo)}
                    className={`group flex items-center gap-2.5 border bg-[#111111]/45 p-2 cursor-pointer transition-colors hover:bg-[#171717] hover:border-slate-700 ${
                      isSelected ? 'border-[#4B8EFF]' : 'border-brand-border'
                    } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* SVG Real Mini preview */}
                    <div className="w-10 h-7 border border-brand-border/60 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0">
                      <img
                        src={demo.imageUrl}
                        alt={demo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-bold text-white tracking-wide truncate">
                        {demo.id}
                      </h4>
                      <span className="text-[8px] text-slate-500 font-semibold tracking-wider uppercase block truncate">
                        {demo.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
