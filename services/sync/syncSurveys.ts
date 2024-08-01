import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { SurveyStore } from '@/store/survey';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncPeople } from './syncPeople';

const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyInput!) {
    createSurvey(input: $input) {
      id
      householdSize
      observations
      catechumens {
        id
      }
      people {
        id
      }
      catechists {
        id
      }
      location {
        id
      }
    }
  }
`;

export const syncSurveys = async () => {
  try {
    const storedSurveys = await AsyncStorage.getItem('surveys');
    const surveys = storedSurveys ? JSON.parse(storedSurveys) : [];

    for (const surveyData of surveys) {
      const peopleSurvey = await syncPeople(surveyData.people);

      const input = {
        catechists: surveyData.catechists.map((c: { id: string }) => c.id),
        catechumens: surveyData.catechumens.map((c: { id: string }) => c.id),
        householdSize: surveyData.householdSize,
        location: surveyData.location?.id,
        observations: surveyData.observations,
        people: peopleSurvey.map((p: { id: string }) => p.id),
      };

      if (!input.location) {
        console.error('Location is undefined for survey:', surveyData);
        continue;
      }

      const { data } = await client.mutate({
        mutation: CREATE_SURVEY,
        variables: { input }
      });

      console.log('Survey synced successfully:', data.createSurvey.id);
    }

    await AsyncStorage.removeItem('surveys');
    SurveyStore.update(s => { s.people = []; });
  } catch (error) {
    console.error('Error syncing surveys:', error);
    throw new Error('Sync failed');
  }
};
