import { useState, useCallback } from 'react';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newElements));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevElements = JSON.parse(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
      return prevElements;
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextElements = JSON.parse(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
      return nextElements;
    }
    return null;
  }, [history, historyIndex]);

  return {
    saveToHistory,
    undo,
    redo
  };
};