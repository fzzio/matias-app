import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '@/types';

export const useCourses = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const storedCourses = await AsyncStorage.getItem('courses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses);
          setCourses(parsedCourses);
        } else {
          throw new Error('No courses found in local storage');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load courses'));
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  return { loading, error, courses };
};
