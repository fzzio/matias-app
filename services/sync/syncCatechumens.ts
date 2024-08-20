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
        description
        room
      }
    }
    getCatechumensWithoutVisitByYear(year: $year) {
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
        description
        room
      }
    }
  }
`;

const UPDATE_CATECHUMEN = gql`
  mutation UpdateCatechumen($id: String!, $data: CatechumenInput!) {
    updateCatechumen(id: $id, data: $data) {
      id
      name
      lastName
    }
  }
`;

export const updateCatechumens = async () => {
  try {
    const storedCatechumens = await AsyncStorage.getItem('catechumensToUpdate');
    const catechumensToUpdate = storedCatechumens ? JSON.parse(storedCatechumens) : [];

    for (const catechumen of catechumensToUpdate) {
      await client.mutate({
        mutation: UPDATE_CATECHUMEN,
        variables: {
          id: catechumen.id,
          data: {
            name: catechumen.name,
            lastName: catechumen.lastName,
            phone: catechumen.phone,
            birthDate: catechumen.birthDate,
            email: catechumen.email,
            sacraments: catechumen.sacraments.map((s: any) => ({ id: s.id })),
            coursesAsCatechumen: catechumen.coursesAsCatechumen.map((c: any) => ({
              id: c.id,
              year: c.year,
              catechismLevel: { id: c.catechismLevel.id },
              location: { id: c.location.id },
              description: c.description,
              room: c.room,
            })),
          },
        },
      });
    }

    await AsyncStorage.removeItem('catechumensToUpdate');
  } catch (error) {
    console.error('Error syncing catechumens:', error);
  }
};


export const syncCatechumens = async (year: string) => {
  try {
    await updateCatechumens();
    const { data } = await client.query({
      query: GET_CATECHUMENS,
      variables: { year }
    });
    await AsyncStorage.setItem('catechumensTotal', JSON.stringify(data.getCatechumensByYear));
    await AsyncStorage.setItem('catechumens', JSON.stringify(data.getCatechumensWithoutVisitByYear));
  } catch (error) {
    console.error('Error syncing catechumensTotal, catechumens:', error);
  }
};
