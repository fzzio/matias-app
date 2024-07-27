import * as React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';
import { updateCatechists } from "@/store/survey";
import { SearchPeople } from '@/components/SearchPeople';
import { Catechist, Catechumen, Person } from '@/types';
import { theme } from '@/styles/theme';
import { commonStyles, buttonStyles } from '@/styles';
import { Pagination } from '@/components/Pagination';

const GET_CATECHISTS = gql`
  query GetCatechists {
    getCatechists {
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
      coursesAsCatechist {
        id
        year
      }
    }
  }
`;

export default function Step1() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_CATECHISTS);
  const [selectedCatechists, setSelectedCatechists] = React.useState<Catechist[]>([]);

  const handleSubmit = () => {
    console.log('Form submitted step1', { selectedCatechists });
    updateCatechists(selectedCatechists);
    router.push('/survey/step2');
  };

  const handleCatechistSelectionChange = (selectedPeople: Person[] | Catechist[] | Catechumen[]) => {
    if (selectedPeople.every(person => (person as Catechist).coursesAsCatechist !== undefined)) {
      setSelectedCatechists(selectedPeople as Catechist[]);
    }
  };

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={1} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Encuesta</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.subtitle}>Seleccione los catequistas que harán ésta visita:</Text>
          <SearchPeople
            placeholder="Buscar catequistas"
            people={data.getCatechists}
            onSelectionChange={handleCatechistSelectionChange}
            personType='Catechist'
            style={styles.searchPeople}
          />
        </View>
        <View style={commonStyles.footerButtons}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={selectedCatechists.length === 0 ? buttonStyles.disabledButton : buttonStyles.primaryButton}
            labelStyle={selectedCatechists.length === 0 ? buttonStyles.disabledButtonLabel : buttonStyles.primaryButtonLabel}
            disabled={selectedCatechists.length === 0}
          >
            Empezar
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/')}
            style={buttonStyles.secondaryButton}
            labelStyle={buttonStyles.secondaryButtonLabel}
          >
            Volver al Menú Principal
          </Button>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  body: {
    gap: 16,
  },
  subtitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onSurface,
  },
  searchPeople: {
    marginBottom: 10,
  },
});
