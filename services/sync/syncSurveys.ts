import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { SurveyStore } from '@/store/survey';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const input = {
        householdSize: surveyData.householdSize,
        catechumens: surveyData.catechumens.map((c: { id: string }) => c.id),
        people: surveyData.people.map((p: { id: string }) => p.id),
        observations: surveyData.observations,
        catechists: surveyData.catechists.map((c: { id: string }) => c.id),
        location: surveyData.selectedLocation?.id
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
