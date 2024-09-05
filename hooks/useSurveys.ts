import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Survey } from '@/types';
import { jsonToSurvey } from '@/utils/surveyUtils';

export const useSurveys = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [pendingSurveys, setPendingSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const storedSurveys = await AsyncStorage.getItem('conductedSurveys');
        const storedPendingSurveys = await AsyncStorage.getItem('pendingSurveys');
        if (storedSurveys) {
          const parsedSurveys = JSON.parse(storedSurveys);
          setSurveys(parsedSurveys);
        } else {
          throw new Error('No surveys found in local storage');
        }

        if (storedPendingSurveys) {
          const parsedPendingSurveys = JSON.parse(storedPendingSurveys).map(jsonToSurvey);
          setPendingSurveys(parsedPendingSurveys);
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

  return { loading, error, surveys, pendingSurveys, getSurveyById };
};
