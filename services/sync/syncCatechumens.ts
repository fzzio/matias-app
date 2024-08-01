import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_CATECHUMENS = gql`
  query GetCatechumens($year: String!) {
    getCatechumensByYear(year: $year) {
      id
      idCard
      name
      lastName
      phone
      birthDate
      email
      sacraments {
        id
      }
      coursesAsCatechumen {
        id
        year
        catechismLevel {
          id
          name
        }
        location {
          id
          name
        }
      }
    }
  }
`;

export const syncCatechumens = async (year: string) => {
  try {
    const { data } = await client.query({
      query: GET_CATECHUMENS,
      variables: { year }
    });
    await AsyncStorage.setItem('catechumens', JSON.stringify(data.getCatechumensByYear));
  } catch (error) {
    console.error('Error syncing catechumens:', error);
  }
};
