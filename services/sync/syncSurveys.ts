import client from '@/services/apollo-client';
import { gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncPeople } from './syncPeople';
import { jsonToSurvey } from '@/utils/surveyUtils';
import { Location, ReportLocation, Sacrament, SacramentReport, Survey } from '@/types';

const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyInput!) {
    createSurvey(input: $input) {
      id
      householdSize
      observations
      catechumens {
        id
      }
      people {
        id
      }
      catechists {
        id
      }
      location {
        id
      }
    }
  }
`;

const CONDUCTED_SURVEYS = gql`
  query GetSurveys {
    getSurveys {
      id
      location {
        id
        name
      }
      catechists {
        id
        lastName
        name
        phone
      }
      catechumens {
        id
        lastName
        name
        idCard
        birthDate
        address
        phone
        email
        location {
          id
          name
        }
        sacraments {
          id
          name
        }
        coursesAsCatechumen {
          id
          catechismLevel {
            id
            name
          }
          description
          room
          year
          location {
            id
            name
          }
        }
      }
      people {
        id
        idCard
        name
        lastName
        birthDate
        isVolunteer
        sacraments {
          id
          name
        }
        missingSacraments {
          id
          name
        }
      }
      householdSize
      observations
      createdAt
      updatedAt
    }
  }
`;

export const syncPendingSurveys = async () => {
  try {
    const storedSurveys = await AsyncStorage.getItem('pendingSurveys');
    const surveys = storedSurveys ? JSON.parse(storedSurveys) : [];

    for (const surveyData of surveys) {
      const peopleSurvey = await syncPeople(surveyData.people);

      const input = {
        catechists: surveyData.catechists.map((c: { id: string }) => c.id),
        catechumens: surveyData.catechumens.map((c: { id: string }) => c.id),
        householdSize: surveyData.householdSize,
        location: surveyData.location?.id,
        observations: surveyData.observations,
        people: peopleSurvey.map((p: { id: string }) => p.id),
      };

      if (!input.location) {
        console.error('Location is undefined for survey:', surveyData);
        continue;
      }

      const { data } = await client.mutate({
        mutation: CREATE_SURVEY,
        variables: { input }
      });

      console.log('Survey synced successfully:', data.createSurvey.id);
    }

    await AsyncStorage.removeItem('pendingSurveys');
  } catch (error) {
    console.error('Error syncing surveys:', error);
    throw new Error('Sync failed');
  }
};

export const syncConductedSurveys = async () => {
  try {
    const { data } = await client.query({ query: CONDUCTED_SURVEYS });
    await AsyncStorage.setItem('conductedSurveys', JSON.stringify(data.getSurveys.map(jsonToSurvey)));
  } catch (error) {
    console.error('Error syncing conductedSurveys:', error);
  }
};

export const calculateSacramentMissingByLocation = async (): Promise<ReportLocation[]> => {
  try {
    const storedLocations = await AsyncStorage.getItem('locations');
    const storedSacraments = await AsyncStorage.getItem('sacraments');
    const storedSurveys = await AsyncStorage.getItem('conductedSurveys');

    if (!storedLocations || !storedSacraments || !storedSurveys) {
      throw new Error('No se encontraron datos necesarios en AsyncStorage.');
    }

    const locations: Location[] = JSON.parse(storedLocations);
    const sacraments: Sacrament[] = JSON.parse(storedSacraments);
    const surveys: Survey[] = JSON.parse(storedSurveys).map(jsonToSurvey);

    const calculateMissingSacramentsForLocation = (locationSurveys: Survey[]): SacramentReport[] => {
      const allPeople = locationSurveys.flatMap(survey => survey.people);
      return sacraments.map(sacrament => ({
        sacrament,
        missingCount: allPeople.filter(person =>
          person.missingSacraments.some(missingSacrament => missingSacrament.id === sacrament.id)
        ).length
      }));
    };

    const reportLocations: ReportLocation[] = locations.map(location => {
      const locationSurveys = surveys.filter(survey => survey.location.id === location.id);
      const sacramentsReport = calculateMissingSacramentsForLocation(locationSurveys);
      return {
        location,
        sacramentsReport
      };
    });

    await AsyncStorage.setItem('missingSacramentsByLocation', JSON.stringify(reportLocations));

    return reportLocations;
  } catch (error) {
    console.error('Error calculando sacramentos faltantes por ubicación:', error);
    throw error;
  }
};

export const calculateTotalMissingSacraments = async (): Promise<SacramentReport[]> => {
  try {
    const storedMissingByLocation = await AsyncStorage.getItem('missingSacramentsByLocation');

    if (!storedMissingByLocation) {
      throw new Error('No se encontraron datos de missingSacramentsByLocation en AsyncStorage.');
    }

    const missingSacramentsByLocation: ReportLocation[] = JSON.parse(storedMissingByLocation);

    const totalMissing: SacramentReport[] = missingSacramentsByLocation
      .flatMap(reportLocation => reportLocation.sacramentsReport)
      .reduce((acc, sacramentReport) => {
        const existingSacramentReport = acc.find(
          report => report.sacrament.id === sacramentReport.sacrament.id
        );

        if (existingSacramentReport) {
          existingSacramentReport.missingCount += sacramentReport.missingCount;
        } else {
          acc.push({
            sacrament: sacramentReport.sacrament,
            missingCount: sacramentReport.missingCount
          });
        }

        return acc;
      }, [] as SacramentReport[])
      .sort((a, b) => b.missingCount - a.missingCount);

    await AsyncStorage.setItem('totalMissingSacraments', JSON.stringify(totalMissing));

    return totalMissing;
  } catch (error) {
    console.error('Error calculando el total de sacramentos faltantes:', error);
    throw error;
  }
};
