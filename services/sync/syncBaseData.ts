import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_BASE_DATA = gql`
  query GetBaseData {
    getLocations {
      id
      name
    }
    getCatechismLevels {
      id
      name
    }
    getSacraments {
      id
      name
    }
  }
`;

export const syncBaseData = async () => {
  try {
    const { data } = await client.query({ query: GET_BASE_DATA });
    await AsyncStorage.setItem('locations', JSON.stringify(data.getLocations));
    await AsyncStorage.setItem('catechismLevels', JSON.stringify(data.getCatechismLevels));
    await AsyncStorage.setItem('sacraments', JSON.stringify(data.getSacraments));
  } catch (error) {
    console.error('Error syncing locations, catechismLevels, sacraments:', error);
  }
};
