import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location } from '@/types';

export const useLocations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const storedLocations = await AsyncStorage.getItem('locations');
        if (storedLocations) {
          const parsedLocations = JSON.parse(storedLocations);
          setLocations(parsedLocations);
        } else {
          throw new Error('No locations found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load locations'));
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []);

  return { loading, error, locations };
};
