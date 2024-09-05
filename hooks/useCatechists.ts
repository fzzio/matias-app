import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Catechist } from '@/types';
import { jsonToCatechist } from '@/utils/catechistUtils';


export const useCatechists = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [catechists, setCatechists] = useState<Catechist[]>([]);

  useEffect(() => {
    const loadCatechists = async () => {
      try {
        const storedCatechists = await AsyncStorage.getItem('catechists');

        if (storedCatechists) {
          setCatechists(JSON.parse(storedCatechists).map(jsonToCatechist));
        } else {
          throw new Error('No storedCatechists found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechists'));
        console.error('Error loading catechists from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatechists();
  }, [loading, error, catechists]);

  return { loading, error, catechists };
};
