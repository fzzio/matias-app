import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Survey } from '@/types';

export const useSurveys = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const storedSurveys = await AsyncStorage.getItem('conductedSurveys');
        if (storedSurveys) {
          const parsedSurveys = JSON.parse(storedSurveys);
          setSurveys(parsedSurveys);
        } else {
          throw new Error('No surveys found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechism levels'));
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  const getSurveyById = (id: string): Survey | null => {
    const survey = surveys.find((l) => l.id === id);
    return survey ? survey : null;
  };

  return { loading, error, surveys, getSurveyById };
};
