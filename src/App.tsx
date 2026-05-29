import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { useLocalStorage } from './hooks/useLocalStorage';

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
      <main className="flex-1 flex flex-col">
        {currentTab === 'landing' ? (
          <LandingPage 
            onStartAnalysis={handleStartAnalysis} 
            onTrySamples={handleTrySamples} 
          />
        ) : (
          <WorkspacePage 
            history={history}
            imagesAnalyzed={imagesAnalyzed}
            addToHistory={addToHistory}
            removeFromHistory={removeFromHistory}
            clearHistory={clearHistory}
            shouldFocusSamples={shouldFocusSamples}
            onResetFocusSamples={handleResetFocusSamples}
          />
        )}
      </main>

      {/* Global Footer Attribution */}
      <footer className="w-full border-t border-brand-border bg-[#0A0A0A] py-2 text-center text-[10px] text-slate-500 font-mono select-none shrink-0">
        Powered by Gemma 4 Vision running locally through Ollama.
      </footer>
    </div>
  );
}

export default App;

