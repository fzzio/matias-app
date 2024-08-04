import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_CATECHISM_LEVELS = gql`
  query GetCatechismLevels {
    getCatechismLevels {
      id
      name
    }
  }
`;

export const syncCatechismLevels = async () => {
  try {
    const { data } = await client.query({ query: GET_CATECHISM_LEVELS });
    await AsyncStorage.setItem('catechismLevels', JSON.stringify(data.getCatechismLevels));
  } catch (error) {
    console.error('Error syncing catechismLevels:', error);
  }
};
