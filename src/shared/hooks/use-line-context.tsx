'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LineContextType {
  selectedLineId: string | null;
  selectedLineName: string | null;
  setSelectedLine: (lineId: string, lineName: string) => void;
}

const LineContext = createContext<LineContextType | undefined>(undefined);

export function LineProvider({ children }: { children: ReactNode }) {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [selectedLineName, setSelectedLineName] = useState<string | null>(null);

  useEffect(() => {
    // ローカルストレージから前回選択したラインを復元
    const savedLineId = localStorage.getItem('selectedLineId');
    const savedLineName = localStorage.getItem('selectedLineName');
    
    if (savedLineId && savedLineName) {
      setSelectedLineId(savedLineId);
      setSelectedLineName(savedLineName);
    }
  }, []);

  const setSelectedLine = (lineId: string, lineName: string) => {
    setSelectedLineId(lineId);
    setSelectedLineName(lineName);
    
    // ローカルストレージに保存
    localStorage.setItem('selectedLineId', lineId);
    localStorage.setItem('selectedLineName', lineName);
  };

  return (
    <LineContext.Provider value={{
      selectedLineId,
      selectedLineName,
      setSelectedLine
    }}>
      {children}
    </LineContext.Provider>
  );
}

export function useLineContext() {
  const context = useContext(LineContext);
  if (context === undefined) {
    throw new Error('useLineContext must be used within a LineProvider');
  }
  return context;
}