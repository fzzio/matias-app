import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_SACRAMENTS = gql`
  query GetSacraments {
    getSacraments {
      id
      name
    }
  }
`;

export const syncSacraments = async () => {
  try {
    const { data } = await client.query({ query: GET_SACRAMENTS });
    await AsyncStorage.setItem('sacraments', JSON.stringify(data.getSacraments));
  } catch (error) {
    console.error('Error syncing sacraments:', error);
  }
};
