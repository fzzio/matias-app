import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CatechismLevel } from '@/types';

export const useCatechismLevels = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [catechismLevels, setCatechismLevels] = useState<CatechismLevel[]>([]);

  useEffect(() => {
    const loadCatechismLevels = async () => {
      try {
        const storedLevels = await AsyncStorage.getItem('catechismLevels');
        if (storedLevels) {
          const parsedLevels = JSON.parse(storedLevels);
          setCatechismLevels(parsedLevels);
        } else {
          throw new Error('No catechism levels found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechism levels'));
      } finally {
        setLoading(false);
      }
    };

    loadCatechismLevels();
  }, []);

  const getCatechismLevelNameById = (id: string): string => {
    const level = catechismLevels.find((l) => l.id === id);
    return level ? level.name : id;
  };

  return { loading, error, catechismLevels, getCatechismLevelNameById };
};
