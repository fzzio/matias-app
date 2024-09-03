import client from '@/services/apollo-client';
import { jsonToCourse } from '@/utils/courseUtils';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GET_COURSES = gql`
  query GetCourses {
    getCourses {
      id
      year
      room
      catechismLevel {
        id
        name
      }
      catechists {
        id
        name
        lastName
      }
      description
      location {
        id
        name
      }
    }
  }
`;

export const syncCourses = async () => {
  try {
    const { data } = await client.query({ query: GET_COURSES });
    await AsyncStorage.setItem('courses', JSON.stringify(data.getCourses.map(jsonToCourse)));
  } catch (error) {
    console.error('Error syncing courses:', error);
  }
};
