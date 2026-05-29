import { useState, useEffect } from 'react';
import { HistoryItem, AnalysisResult } from '../types/index';

export const useLocalStorage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [imagesAnalyzed, setImagesAnalyzed] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('codelens_history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedStats = localStorage.getItem('codelens_stats');
      if (storedStats) {
        setImagesAnalyzed(parseInt(storedStats, 10));
      }
    } catch (e) {
      console.error('Error reading localStorage data:', e);
    }
  }, []);

  /**
   * Save an item to the analysis history list
   */
  const addToHistory = (
    imageName: string,
    imageSize: string,
    imageType: string,
    imageUrl: string,
    results: AnalysisResult
  ): HistoryItem => {
    const newItem: HistoryItem = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      imageName,
      imageSize,
      imageType,
      imageUrl,
      timestamp: new Date().toLocaleString(),
      results,
    };

    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('codelens_history', JSON.stringify(updatedHistory));

    const updatedStats = imagesAnalyzed + 1;
    setImagesAnalyzed(updatedStats);
    localStorage.setItem('codelens_stats', updatedStats.toString());

    return newItem;
  };

  /**
   * Delete an item from the history
   */
  const removeFromHistory = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('codelens_history', JSON.stringify(updatedHistory));
  };

  /**
   * Clear the entire history cache
   */
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('codelens_history');
    // We can choose to keep or clear stats. Let's keep stats for total historic analyses, but allow clearing history.
  };

  return {
    history,
    imagesAnalyzed,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
