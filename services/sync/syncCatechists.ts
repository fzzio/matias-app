import client from '@/services/apollo-client';
import { jsonToCatechist } from '@/utils/catechistUtils';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_CATECHISTS = gql`
  query GetCatechists {
    getCatechists {
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
      coursesAsCatechist {
        id
        year
      }
    }
  }
`;

export const syncCatechists = async () => {
  try {
    const { data } = await client.query({ query: GET_CATECHISTS });
    await AsyncStorage.setItem('catechists', JSON.stringify(data.getCatechists.map(jsonToCatechist)));
  } catch (error) {
    console.error('Error syncing catechists:', error);
  }
};
