import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateSacraments } from '@/store/survey';
import { Sacrament } from '@/types';

export const useSacraments = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sacraments, setSacraments] = useState<Sacrament[]>([]);

  useEffect(() => {
    const loadSacraments = async () => {
      try {
        const storedSacraments = await AsyncStorage.getItem('sacraments');
        if (storedSacraments) {
          const parsedSacraments = JSON.parse(storedSacraments);
          setSacraments(parsedSacraments);
          updateSacraments(parsedSacraments);
        } else {
          throw new Error('No sacraments found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load sacraments'));
      } finally {
        setLoading(false);
      }
    };

    loadSacraments();
  }, []);

  const getSacramentNameById = (id: string): string => {
    const sacrament = sacraments.find((s) => s.id === id);
    return sacrament ? sacrament.name : id;
  };

  return { loading, error, sacraments, getSacramentNameById };
};
