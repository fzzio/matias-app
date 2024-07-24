import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { SurveyStore, clearSurvey } from '@/store/survey';
import { Pagination } from '@/components/Pagination';
import { gql, useMutation } from '@apollo/client';
import { PersonInput } from '@/types';
import LottieView from 'lottie-react-native';
import CatechumenInfo from '@/components/Catechumen';
import PersonInfo from '@/components/PersonInfo';
import CatechistInfo from '@/components/CatechistInfo';

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

export default function Step4() {
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

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Información guardada con éxito</Text>
            <Button onPress={closeModal}>Cerrar</Button>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : (
        <>
          <Pagination currentStep={4} totalSteps={4} />
          <Text variant="headlineMedium">Revisión de la Información</Text>
          <LottieView
            source={require("../assets/lottiefiles/1720857631441.json")}
            style={styles.headerLottieImage}
            autoPlay
            loop
          />

          <Text variant="titleSmall">Catequistas</Text>
          {catechists.map((catechist, index) => <CatechistInfo catechist={catechist} key={`catechist_${index}`} />)}
          <Divider style={styles.divider} />

          <Text variant="titleSmall">Ubicación Seleccionada</Text>
          <Text>{selectedLocation?.name || 'N/A'}</Text>
          <Divider style={styles.divider} />

          <Text variant="titleSmall">Tamaño del Hogar</Text>
          <Text>{householdSize}</Text>
          <Divider style={styles.divider} />

          <Text variant="titleLarge">Catequizandos</Text>
          {catechumens.map((person, index) => <CatechumenInfo catechumen={person} key={`catechumen_${index}`} />)}
          <Divider style={styles.divider} />

          <Text variant="titleLarge">Otras Personas</Text>
          {otherPeople.map((person, index) => <PersonInfo person={person} key={`person_${index}`} />)}
          <Divider style={styles.divider} />

          <Text variant="titleLarge">Observaciones</Text>
          <Text>{observations}</Text>
          <Divider style={styles.divider} />

          <View style={styles.footer}>
            <Button onPress={() => router.back()}>Atrás</Button>
            <Button mode="contained" disabled={isLoading} onPress={handleFinish}>
              Finalizar
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  personContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerLottieImage: {
    width: "100%",
    height: 200,
    marginBottom: 10
  },
  divider: {
    marginTop: 10,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
