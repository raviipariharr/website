import { createContext, useContext, useState, useCallback } from 'react';
import { HEART_IDS } from '../data/heartsConfig.js';

const HeartsContext = createContext(null);

export function HeartsProvider({ children }) {
  const [foundHearts, setFoundHearts] = useState([]);

  const addHeart = useCallback((id) => {
    setFoundHearts((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const isFound = useCallback(
    (id) => foundHearts.includes(id),
    [foundHearts]
  );

  return (
    <HeartsContext.Provider
      value={{
        foundHearts,
        addHeart,
        isFound,
        totalHearts: HEART_IDS.length,
        allFound: foundHearts.length >= HEART_IDS.length,
      }}
    >
      {children}
    </HeartsContext.Provider>
  );
}

export function useHearts() {
  const context = useContext(HeartsContext);
  if (!context) {
    throw new Error('useHearts must be used within a HeartsProvider');
  }
  return context;
}