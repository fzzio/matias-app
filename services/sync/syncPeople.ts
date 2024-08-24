import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import { PersonInput } from '@/types';

const CREATE_PEOPLE_BULK = gql`
  mutation CreatePeopleBulk($input: [PersonInput!]!) {
    createPeopleBulk(input: $input) {
      id
      idCard
      name
      lastName
    }
  }
`;

export const syncPeople = async (people: PersonInput[]) => {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_PEOPLE_BULK,
      variables: { input: people }
    });

    console.log('People saved successfully');
    return data.createPeopleBulk;
  } catch (error) {
    console.error('Error syncing people:', error);
    throw new Error('Sync failed');
  }
};
