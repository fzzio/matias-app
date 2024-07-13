import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechizand } from '../types';

const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      id
      name
    }
  }
`;

const GET_CATECHIZANDS = gql`
  query GetCatechizands {
    getCatechizands {
      id
      name
      lastName
    }
  }
`;

export default function Step1() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [peopleCount, setPeopleCount] = useState('');
  const [selectedCatechizands, setSelectedCatechizands] = useState<Catechizand[]>([]);

  const { loading: loadingLocations, error: errorLocations, data: locationsData } = useQuery(GET_LOCATIONS);
  const { loading: loadingCatechizands, error: errorCatechizands, data: catechizandsData } = useQuery(GET_CATECHIZANDS);

  if (loadingLocations || loadingCatechizands) return <Text>Loading...</Text>;
  if (errorLocations || errorCatechizands) return <Text>Error: {errorLocations?.message || errorCatechizands?.message}</Text>;

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted', { selectedLocation, peopleCount, selectedCatechizands });
    router.push('/step2');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={1} totalSteps={3} />
      <Text variant="headlineMedium">1.- Información del Hogar</Text>

      <SearchLocation
        locations={locationsData.getLocations}
        onLocationSelect={setSelectedLocation}
        placeholder="Seleccionar ubicación"
      />

      <TextInput
        label="Número de personas viviendo en el hogar"
        value={peopleCount}
        onChangeText={setPeopleCount}
        keyboardType="numeric"
        style={styles.input}
      />

      <SearchPeople
        people={catechizandsData.getCatechizands}
        onSelectionChange={setSelectedCatechizands}
        placeholder="Buscar catequizandos"
      />

      <View style={styles.buttonContainer}>
        <Link href="/" asChild>
          <Button>Atrás</Button>
        </Link>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!selectedLocation || !peopleCount }
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});