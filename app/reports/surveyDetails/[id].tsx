import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buttonStyles, commonStyles } from '@/styles';
import { useSurveys } from '@/hooks/useSurveys';
import InfoItem from '@/components/InfoItem';
import PersonInfo from '@/components/PersonInfo';
import CatechumenInfo from '@/components/CatechumenInfo';
import CatechistInfo from '@/components/CatechistInfo';
import { formatDateToString, formatHourToString } from '@/utils/dateUtils';

export default function SurveyDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getSurveyById, loading, error } = useSurveys();

  const survey = getSurveyById(id as string);

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (!!!survey) return <Text style={commonStyles.errorText}>No survey data</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>
            Entrevista
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <InfoItem
            label="Fecha"
            value={survey.createdAt ? formatDateToString(survey.createdAt) : 'N/A'}
          />
          <InfoItem
            label="Hora"
            value={survey.createdAt ? formatHourToString(survey.createdAt) : 'N/A'}
          />
          <InfoItem
            label="Localidad"
            value={survey.location ? survey.location.name : 'N/A'}
          />
          <InfoItem
            label="Integrantes de la familia"
            value={survey.householdSize ? survey.householdSize : 'N/A'}
          />
          <InfoItem
            label="Observaciones"
            value={survey.observations ? survey.observations : 'N/A'}
          />
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Catequizandos: {survey.catechumens ? survey.catechumens.length : 0}</Text>
            {survey.catechumens?.map((catechumen, index) => (
              <CatechumenInfo
                catechumen={catechumen}
                key={`catechumen_${index}`}
              />
            ))}
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Personas: {survey.people ? survey.people.length : 0}</Text>
            {survey.people?.map((person, index) => (
              <PersonInfo person={person} key={`person_${index}`} />
            ))}
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Visitados por: </Text>
            {survey.catechists?.map((catechist, index) => (
              <CatechistInfo catechist={catechist} key={`catechist_${index}`} />
            ))}
          </View>
        </View>
      </Surface>
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={buttonStyles.secondaryButton}
          labelStyle={buttonStyles.secondaryButtonLabel}
        >
          Atrás
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  courseContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  locationTitle: {
    ...commonStyles.subtitle,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  infoContainer: {
    gap: 8,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
  },
});
