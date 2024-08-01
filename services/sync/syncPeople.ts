import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { PersonInput } from '@/types';
import { SurveyStore } from '@/store/survey';

const CREATE_PEOPLE_BULK = gql`
  mutation CreatePeopleBulk($input: [PersonInput!]!) {
    createPeopleBulk(input: $input) {
      id
      idCard
      name
      lastName
      birthDate
      email
      phone
      isVolunteer
      sacraments {
        id
      }
    }
  }
`;

export const syncPeople = async (people: PersonInput[]) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_PEOPLE_BULK,
      variables: { input: people }
    });

    SurveyStore.update(s => { s.people = data.createPeopleBulk; });
    console.log('People synced successfully');
    return data.createPeopleBulk;
  } catch (error) {
    console.error('Error syncing people:', error);
    throw new Error('Sync failed');
  }
};
