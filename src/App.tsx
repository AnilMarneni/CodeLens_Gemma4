import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentTab, setTab] = useState<'landing' | 'workspace'>('landing');
  const [shouldFocusSamples, setShouldFocusSamples] = useState(false);
  
  // Custom Local Storage hook
  const {
    history,
    imagesAnalyzed,
    addToHistory,
    removeFromHistory,
    clearHistory
  } = useLocalStorage();

  const handleStartAnalysis = () => {
    setTab('workspace');
    setShouldFocusSamples(false);
  };

  const handleTrySamples = () => {
    setTab('workspace');
    setShouldFocusSamples(true);
  };

  const handleResetFocusSamples = () => {
    setShouldFocusSamples(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg font-sans selection:bg-brand-accent/35 selection:text-white">
      {/* Header Navigation */}
      <Navbar 
        imagesAnalyzed={imagesAnalyzed} 
        currentTab={currentTab} 
        setTab={setTab} 
      />

      {/* Pages Router Wrapper */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentTab === 'landing' ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <LandingPage 
                onStartAnalysis={handleStartAnalysis} 
                onTrySamples={handleTrySamples} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="workspace-container"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="w-full h-full flex-1 flex flex-col"
            >
              <WorkspacePage 
                history={history}
                imagesAnalyzed={imagesAnalyzed}
                addToHistory={addToHistory}
                removeFromHistory={removeFromHistory}
                clearHistory={clearHistory}
                shouldFocusSamples={shouldFocusSamples}
                onResetFocusSamples={handleResetFocusSamples}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Footer Attribution */}
      <footer className="w-full border-t border-brand-border bg-[#0A0A0A] py-2 text-center text-[10px] text-slate-500 font-mono select-none shrink-0">
        Powered by Gemma 4 Vision running locally through Ollama.
      </footer>
    </div>
  );
}

export default App;

