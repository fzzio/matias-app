import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, Surface } from 'react-native-paper';
import { clearSurvey, SurveyStore, updateCatechumenData } from '@/store/survey';
import { Pagination } from '@/components/Pagination';
import { commonStyles, buttonStyles } from '@/styles';
import { theme } from '@/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CatechumenInfo from '@/components/CatechumenInfo';
import PersonInfo from '@/components/PersonInfo';
import CatechistInfo from '@/components/CatechistInfo';
import InfoItem from '@/components/InfoItem';
import { Catechumen } from '@/types';

export default function Step5() {
  const router = useRouter();
  const {
    catechists,
    location,
    householdSize,
    catechumens,
    people,
    observations
  } = SurveyStore.useState();
  const [showModal, setShowModal] = useState(false);

  const handleFinish = async () => {
    const newSurvey = {
      catechists: catechists,
      location: location,
      householdSize,
      catechumens: catechumens,
      people: people,
      observations
    };

    const storedSurveys = await AsyncStorage.getItem('surveys');
    const surveys = storedSurveys ? JSON.parse(storedSurveys) : [];

    surveys.push(newSurvey);
    await AsyncStorage.setItem('surveys', JSON.stringify(surveys));

    setShowModal(true);
  };

  const closeModal = () => {
    console.log('Step 5... Done!');
    setShowModal(false);
    clearSurvey();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
          <Text style={styles.sectionTitle}>Información General</Text>
          <Surface style={styles.infoCard}>
            <InfoItem label="Ubicación Seleccionada" value={location?.name || 'N/A'} />
            <InfoItem label="Tamaño del Hogar" value={householdSize.toString()} />
            <InfoItem label="Observaciones" value={observations || 'N/A'} />
          </Surface>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Catequizandos</Text>
          {catechumens.map((person, index) => (
            <CatechumenInfo
              catechumen={person}
              key={`catechumen_${index}`}
              onUpdate={(updatedCatechumen: Catechumen) => {
                updateCatechumenData(updatedCatechumen);
              }}
            />
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Otras Personas</Text>
          {people.map((person, index) => (
            <PersonInfo person={person} key={`person_${index}`} />
          ))}
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 10,
  },
  infoCard: {
    padding: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  footerButtons: {
    marginTop: 20,
  },
});
