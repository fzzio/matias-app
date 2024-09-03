import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncPeople } from './syncPeople';
import { jsonToSurvey } from '@/utils/surveyUtils';

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

const CONDUCTED_SURVEYS = gql`
  query GetSurveys {
    getSurveys {
      id
      location {
        id
        name
      }
      catechists {
        id
        lastName
        name
        phone
      }
      catechumens {
        id
        lastName
        name
        idCard
        birthDate
        address
        phone
        email
        location {
          id
          name
        }
        sacraments {
          id
          name
        }
        coursesAsCatechumen {
          id
          catechismLevel {
            id
            name
          }
          description
          room
          year
          location {
            id
            name
          }
        }
      }
      people {
        id
        idCard
        name
        lastName
        birthDate
        isVolunteer
        sacraments {
          id
          name
        }
        missingSacraments {
          id
          name
        }
      }
      householdSize
      observations
      createdAt
      updatedAt
    }
  }
`;

export const syncPendingSurveys = async () => {
  try {
    const storedSurveys = await AsyncStorage.getItem('pendingSurveys');
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

    await AsyncStorage.removeItem('pendingSurveys');
  } catch (error) {
    console.error('Error syncing surveys:', error);
    throw new Error('Sync failed');
  }
};

export const syncConductedSurveys = async () => {
  try {
    const { data } = await client.query({ query: CONDUCTED_SURVEYS });
    await AsyncStorage.setItem('conductedSurveys', JSON.stringify(data.getSurveys.map(jsonToSurvey)));
  } catch (error) {
    console.error('Error syncing conductedSurveys:', error);
  }
};
