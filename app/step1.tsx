import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import LottieView from "lottie-react-native";

import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechizand } from '@/types';

const GET_LOCATIONS = gql`
  query GetLocations {
    getLocations {
      id
      name
    }
  }
`;

const GET_CATECHIZANDS = gql`
  query GetCatechizands($year: String!) {
    getCatechizands(year: $year) {
      id
      name
      lastName
      sacraments {
        id
      }
    }
  }
`;

export default function Step1() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [peopleCount, setPeopleCount] = useState('');
  const [selectedCatechizands, setSelectedCatechizands] = useState<Catechizand[]>([]);

  const { loading: loadingLocations, error: errorLocations, data: locationsData } = useQuery(GET_LOCATIONS);
  const { loading: loadingCatechizands, error: errorCatechizands, data: catechizandsData } = useQuery(GET_CATECHIZANDS, {
    variables: { year: "2024" },
  });

  if (loadingLocations || loadingCatechizands) return <Text>Loading...</Text>;
  if (errorLocations || errorCatechizands) return <Text>Error: {errorLocations?.message || errorCatechizands?.message}</Text>;

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted', { selectedLocation, peopleCount, selectedCatechizands });
    router.push({
      pathname: '/step2',
      params: {
        peopleCount: peopleCount,
        selectedCatechizands: JSON.stringify(selectedCatechizands)
      }
    });
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={1} totalSteps={3} />
      <LottieView
        source={require("../assets/lottiefiles/1721342873275.json")}
        style={styles.headerLottieImage}
        autoPlay
        loop
      />
      <View style={styles.header}>
        <Text variant="headlineMedium">Información del Hogar</Text>
      </View>
      <View style={styles.body}>
        <SearchLocation
          locations={locationsData.getLocations}
          onLocationSelect={setSelectedLocation}
          placeholder="Buscar ubicación"
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
      </View>
      <View style={styles.footer}>
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
    padding: 18,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: "column",
    alignContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  headerLottieImage: {
    width: "100%",
    height: "25%",
    marginBottom: 10
  },
  body: {
    flexDirection: "column",
    gap: 16,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 16
  },
  input: {
    backgroundColor: "#FFFFFF"
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});