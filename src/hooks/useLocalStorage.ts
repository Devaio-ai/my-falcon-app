import { useState, useEffect } from 'react';
import localforage from 'localforage';

localforage.config({
  name: 'falcon-surveillance',
  storeName: 'surveillance-data'
});

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const value = await localforage.getItem<T>(key);
        if (value !== null) {
          setStoredValue(value);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key]);

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await localforage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
} 