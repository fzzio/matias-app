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

const UPDATE_CATECHUMEN_BULK = gql`
  mutation UpdateCatechumensBulk($input: [CatechumenUpdateInput!]!) {
    updateCatechumensBulk(input: $input) {
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

export const updateCatechumensBulk = async () => {
  try {
    const storedCatechumens = await AsyncStorage.getItem('catechumensToUpdate');
    const catechumensToUpdate = storedCatechumens ? JSON.parse(storedCatechumens) : [];

    if (catechumensToUpdate.length > 0) {
      const { data } = await client.mutate({
        mutation: UPDATE_CATECHUMEN_BULK,
        variables: {
          input: catechumensToUpdate.map((c: any) => ({
            id: c.id,
            name: c.name,
            lastName: c.lastName,
            idCard: c.idCard,
            phone: c.phone,
            birthDate: c.birthDate,
            location: c.location,
            address: c.address,
          })),
        },
      });

      console.log('Catechumens updated successfully:', data.updateCatechumensBulk);
    }

    await AsyncStorage.removeItem('catechumensToUpdate');
  } catch (error) {
    console.error('Error syncing catechumens:', error);
  }
};


export const syncCatechumens = async (year: string) => {
  try {
    await updateCatechumensBulk();
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
