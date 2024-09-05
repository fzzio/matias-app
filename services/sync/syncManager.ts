import client from '@/services/apollo-client';
import { syncBaseData } from './syncBaseData';
import { syncCatechists } from './syncCatechists';
import { syncCatechumens } from './syncCatechumens';
import { syncCourses } from './syncCourses';
import { calculateSacramentMissingByLocation, calculateTotalMissingSacraments, syncConductedSurveys, syncPendingSurveys } from './syncSurveys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncManager = async (options = { forceFull: false }) => {
  try {
    await client.clearStore();

    await syncBaseData();
    await syncCatechists();
    await syncCourses();

    const surveys = await AsyncStorage.getItem('pendingSurveys');
    const pendingSurveys = surveys ? JSON.parse(surveys) : [];

    if (pendingSurveys.length > 0 || options.forceFull) {
      await syncPendingSurveys();
    }

    await syncCatechumens("2024");
    await syncConductedSurveys();

    await calculateSacramentMissingByLocation();
    await calculateTotalMissingSacraments();

    console.log('All data synced successfully');
  } catch (error) {
    console.error('Error syncing all data:', error);
    throw error;
  }
};
