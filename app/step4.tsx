import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { Button, Text, Divider } from 'react-native-paper';
import { SurveyStore, clearSurvey } from '@/store/survey';
import { Pagination } from '@/components/Pagination';
import { gql, useMutation } from '@apollo/client';
import { useSacraments } from '@/hooks/useSacraments';
import { PersonInput } from '@/types';

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
  const { getSacramentNameById } = useSacraments();
  const [createSurvey] = useMutation(CREATE_SURVEY);
  const [createPeopleBulk, { data, loading, error }] = useMutation(CREATE_PEOPLE_BULK);

  const handleSavePeople = async (people: PersonInput[]) => {
    try {
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

      if (response.data.createPeopleBulk) {
        console.log("Personas creadas exitosamente", response.data.createPeopleBulk);
        return response.data.createPeopleBulk.map((person: any) => person.id);
      }
    } catch (error) {
      console.error("Error al crear personas", error);
      throw new Error("Error al crear personas");
    }
  };


  const handleFinish = async () => {
    if (!selectedLocation) {
      console.error("No se seleccionó ubicación.");
      return;
    }

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
        console.log("Encuesta creada exitosamente");
        clearSurvey();
        router.push('/');
      }
    } catch (error) {
      console.error("Error al guardar la encuesta:", error);
    }
  };

  const renderPersonInfo = (person: PersonInput, index: number) => (
    <View key={`${person.id}_${index}`} style={styles.personContainer}>
      <Text>Nombre: {person.name} {person.lastName}</Text>
      <Text>Cédula: {person.idCard || 'N/A'}</Text>
      <Text>Fecha de Nacimiento: {person.birthDate ? person.birthDate.toISOString().split('T')[0] : 'N/A'}</Text>
      <Text>Sacramentos: {person.sacraments.map(getSacramentNameById).join(', ') || 'N/A'}</Text>
      <Text>Voluntario: {person.isVolunteer ? 'Sí' : 'No'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Pagination currentStep={4} totalSteps={4} />
      <LottieView
        source={require("../assets/lottiefiles/1720857631441.json")}
        style={styles.headerLottieImage}
        autoPlay
        loop
      />
      <Text variant="headlineMedium">Revisión de la Información</Text>

      <Text variant="titleSmall">Catequistas</Text>
      {catechists.map((catechist, index) => (
        <Text key={`${catechist.id}_${index}`}>{catechist.name} {catechist.lastName}</Text>
      ))}
      <Divider style={styles.divider} />

      <Text variant="titleSmall">Ubicación Seleccionada</Text>
      <Text>{selectedLocation?.name || 'N/A'}</Text>
      <Divider style={styles.divider} />

      <Text variant="titleSmall">Tamaño del Hogar</Text>
      <Text>{householdSize}</Text>
      <Divider style={styles.divider} />

      <Text variant="titleLarge">Catequizandos</Text>
      {catechumens.map((person, index) => renderPersonInfo(person, index))}
      <Divider style={styles.divider} />

      <Text variant="titleLarge">Otras Personas</Text>
      {otherPeople.map((person, index) => renderPersonInfo(person, index + catechumens.length))}
      <Divider style={styles.divider} />

      <Text variant="titleLarge">Observaciones</Text>
      <Text>{observations}</Text>
      <Divider style={styles.divider} />

      <View style={styles.footer}>
        <Button onPress={() => router.back()}>Atrás</Button>
        <Button
          mode="contained"
          onPress={handleFinish}
        >
          Finalizar
        </Button>
      </View>
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
