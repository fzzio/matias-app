import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechumen, Person, Catechist } from '@/types';
import { updateSelectedLocation, updateHouseholdSize, updateCatechumens } from "@/store/survey";
import { commonStyles, buttonStyles, inputStyles } from '@/styles';

const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      id
      name
    }
  }
`;

const GET_CATECHUMENS = gql`
  query GetCatechumens($year: String!) {
    getCatechumens(year: $year) {
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
      }
    }
  }
`;

export default function Step2() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [householdSize, setHouseholdSize] = useState('');
  const [selectedCatechumens, setSelectedCatechumens] = useState<Catechumen[]>([]);

  const { loading: loadingLocations, error: errorLocations, data: locationsData } = useQuery(GET_LOCATIONS);
  const { loading: loadingCatechumens, error: errorCatechumens, data: catechumensData } = useQuery(GET_CATECHUMENS, {
    variables: { year: "2024" },
  });

  const handleSubmit = () => {
    console.log('Form submitted Step2');
    updateHouseholdSize(parseInt(householdSize));
    updateSelectedLocation(selectedLocation);
    updateCatechumens(selectedCatechumens);
    router.push('/survey/step3');
  };

  const handleCatechumenSelectionChange = (selectedPeople: Person[] | Catechist[] | Catechumen[]) => {
    if (selectedPeople.every(person => (person as Catechumen).coursesAsCatechumen !== undefined)) {
      setSelectedCatechumens(selectedPeople as Catechumen[]);
    }
  };

  if (loadingLocations || loadingCatechumens) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (errorLocations || errorCatechumens) return <Text style={commonStyles.errorText}>Error: {errorLocations?.message || errorCatechumens?.message}</Text>;

  const isFormValid = selectedLocation && householdSize !== '';

  return (
    <View style={styles.container}>
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={2} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Información del Hogar</Text>
        </View>
        <View style={styles.body}>
          <SearchLocation
            locations={locationsData.getLocations}
            onLocationSelect={setSelectedLocation}
            placeholder="Buscar ubicación"
          />
          <SearchPeople
            people={catechumensData.getCatechumens}
            onSelectionChange={handleCatechumenSelectionChange}
            placeholder="Buscar catequizandos"
            personType='Catechumen'
          />
          <TextInput
            label="Total personas en el hogar"
            value={householdSize}
            onChangeText={setHouseholdSize}
            keyboardType="numeric"
            style={inputStyles.defaultInput}
          />
        </View>
        <View style={commonStyles.footerButtons}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={isFormValid ? buttonStyles.primaryButton : buttonStyles.disabledButton}
            labelStyle={isFormValid ? buttonStyles.primaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={!isFormValid}
          >
            Continuar
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  body: {
    gap: 16,
    marginBottom: 24,
  },
});
