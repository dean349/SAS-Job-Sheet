import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null) return defaultValue;
      if (typeof defaultValue === 'string') {
        // Backward compatibility with plain string keys like 'dean_brand'
        if (stored.startsWith('"') && stored.endsWith('"')) {
          return JSON.parse(stored) as T;
        }
        return stored as unknown as T;
      }
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof state === 'string') {
        localStorage.setItem(key, state);
      } else {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // Ignore storage errors in private or restricted mobile WebViews
    }
  }, [key, state]);

  return [state, setState];
}
