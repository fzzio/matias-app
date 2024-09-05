import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Catechumen } from '@/types';
import { jsonToCatechumen } from '@/utils/catechumenUtils';


export const useCatechumens = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [catechumens, setCatechumens] = useState<Catechumen[]>([]);
  const [catechumensTotal, setCatechumensTotal] = useState<Catechumen[]>([]);

  useEffect(() => {
    const loadCatechumens = async () => {
      try {
        const storedCatechumens = await AsyncStorage.getItem('catechumens');
        const storedCatechumensTotal = await AsyncStorage.getItem('catechumensTotal');

        if (storedCatechumens) {
          setCatechumens(JSON.parse(storedCatechumens).map(jsonToCatechumen));
        } else {
          throw new Error('No storedCatechumens found in local storage');
        }

        if (storedCatechumensTotal) {
          setCatechumensTotal(JSON.parse(storedCatechumensTotal).map(jsonToCatechumen));
        } else {
          throw new Error('No storedCatechumensTotal found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechumens'));
        console.error('Error loading catechumens from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatechumens();
  }, [loading, error, catechumens, catechumensTotal]);

  return { loading, error, catechumens, catechumensTotal };
};
