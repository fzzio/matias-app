import { syncCatechismLevels } from './syncCatechismLevels';
import { syncCatechists } from './syncCatechists';
import { syncCatechumens, syncCatechumensWithoutVisit } from './syncCatechumens';
import { syncCourses } from './syncCourses';
import { syncLocations } from './syncLocations';
import { syncSacraments } from './syncSacraments';
import { syncConductedSurveys, syncSurveys } from './syncSurveys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const syncManager = async (options = { forceFull: false }) => {
  try {
    await syncCatechists();
    await syncCatechumens("2024");
    await syncCatechumensWithoutVisit("2024");
    await syncLocations();
    await syncSacraments();
    await syncCatechismLevels();
    await syncCourses();
    await syncConductedSurveys();

    const surveys = await AsyncStorage.getItem('surveys');
    const pendingSurveys = surveys ? JSON.parse(surveys) : [];

    if (pendingSurveys.length > 0 || options.forceFull) {
      await syncSurveys();
    }

    console.log('All data synced successfully');
  } catch (error) {
    console.error('Error syncing all data:', error);
    throw error;
  }
};
