import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, Divider, ActivityIndicator, Surface } from 'react-native-paper';
import { SurveyStore, clearSurvey } from '@/store/survey';
import { Pagination } from '@/components/Pagination';
import { gql, useMutation } from '@apollo/client';
import { PersonInput } from '@/types';
import LottieView from 'lottie-react-native';
import CatechumenInfo from '@/components/CatechumenInfo';
import PersonInfo from '@/components/PersonInfo';
import CatechistInfo from '@/components/CatechistInfo';
import { commonStyles, buttonStyles } from '@/styles';
import { theme } from '@/styles/theme';

const CREATE_SURVEY = gql`
  mutation CreateSurvey($input: SurveyInput!) {
    createSurvey(input: $input) {
      id
      householdSize
      observations
    }
  }
`;

const CREATE_PEOPLE_BULK = gql`
  mutation CreatePeopleBulk($input: [PersonInput!]!) {
    createPeopleBulk(input: $input) {
      id
      name
      lastName
      email
      phone
    }
  }
`;

export default function Step5() {
  const router = useRouter();
  const { catechists, selectedLocation, householdSize, catechumens, otherPeople, observations } = SurveyStore.useState();
  const [createSurvey] = useMutation(CREATE_SURVEY);
  const [createPeopleBulk] = useMutation(CREATE_PEOPLE_BULK);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSavePeople = async (people: PersonInput[]) => {
    const response = await createPeopleBulk({
      variables: {
        input: people.map((person: PersonInput) => ({
          idCard: person.idCard,
          name: person.name,
          lastName: person.lastName,
          email: person.email,
          phone: person.phone,
          birthDate: person.birthDate ? person.birthDate.toISOString() : null,
          sacraments: person.sacraments,
          isCatechist: person.isCatechist,
          isVolunteer: person.isVolunteer
        })),
      },
    });
    return response.data.createPeopleBulk.map((person: any) => person.id);
  };

  const handleFinish = async () => {
    if (!selectedLocation) {
      console.error("No se seleccionó ubicación.");
      return;
    }

    setIsLoading(true);
    try {
      const newPeopleIds = await handleSavePeople(otherPeople);
      const surveyResponse = await createSurvey({
        variables: {
          input: {
            householdSize,
            observations,
            catechumensInHousehold: catechumens.map(c => c.id),
            nonParticipants: newPeopleIds,
            catechists: catechists.map(c => c.id),
            location: selectedLocation.id,
          },
        },
      });

      if (surveyResponse.data.createSurvey) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al guardar la encuesta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    clearSurvey();
    router.push('/');
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={commonStyles.surface}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <Surface style={styles.modalView}>
              <Text style={styles.modalText}>Información guardada con éxito</Text>
              <Button mode="contained" onPress={closeModal} style={buttonStyles.primaryButton}>
                Cerrar
              </Button>
            </Surface>
          </View>
        </Modal>

        <Pagination currentStep={5} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Revisión de la Información</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catequistas</Text>
          {catechists.map((catechist, index) => (
            <CatechistInfo catechist={catechist} key={`catechist_${index}`} />
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ubicación Seleccionada</Text>
          <Text style={styles.sectionContent}>{selectedLocation?.name || 'N/A'}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Tamaño del Hogar</Text>
          <Text style={styles.sectionContent}>{householdSize}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catequizandos</Text>
          {catechumens.map((person, index) => (
            <CatechumenInfo catechumen={person} key={`catechumen_${index}`} />
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Otras Personas</Text>
          {otherPeople.map((person, index) => (
            <PersonInfo person={person} key={`person_${index}`} />
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          <Text style={styles.sectionContent}>{observations}</Text>
        </View>

        <View style={commonStyles.footerButtons}>
          <Button
            mode="contained"
            onPress={handleFinish}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
          >
            Finalizar
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={buttonStyles.secondaryButton}
            labelStyle={buttonStyles.secondaryButtonLabel}
          >
            Atrás
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: theme.roundness,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    ...commonStyles.bodyText,
  },
  headerLottieImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 10,
  },
  sectionContent: {
    // TODO
  },
});
