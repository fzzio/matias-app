import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      id
      name
    }
  }
`;

export const syncLocations = async () => {
  try {
    const { data } = await client.query({ query: GET_LOCATIONS });
    await AsyncStorage.setItem('locations', JSON.stringify(data.getLocations));
  } catch (error) {
    console.error('Error syncing locations:', error);
  }
};
