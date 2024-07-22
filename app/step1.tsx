import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import LottieView from "lottie-react-native";

import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechumen } from '@/types';
import { SurveyStore, updateSelectedLocation, updateHouseholdSize, updateCatechumens } from "@/store/survey";

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
  const [householdSize, setHouseholdSize] = useState('');
  const [selectedCatechumens, setSelectedCatechumens] = useState<Catechumen[]>([]);

  const { loading: loadingLocations, error: errorLocations, data: locationsData } = useQuery(GET_LOCATIONS);
  const { loading: loadingCatechumens, error: errorCatechumens, data: catechumensData } = useQuery(GET_CATECHUMENS, {
    variables: { year: "2024" },
  });

  const handleSubmit = () => {
    console.log('Form submitted Step1');
    const catechumensAsPersonInput = selectedCatechumens.map(({ id, idCard, name, lastName, birthDate, sacraments }) => ({
      id,
      idCard,
      name,
      lastName,
      birthDate,
      sacraments: sacraments.map(sacrament => sacrament.id),
      isVolunteer: false,
    }));
    updateHouseholdSize(parseInt(householdSize));
    updateCatechumens(catechumensAsPersonInput);
    router.push('/step2');
  };


  if (loadingLocations || loadingCatechumens) return <Text>Cargando...</Text>;
  if (errorLocations || errorCatechumens) return <Text>Error: {errorLocations?.message || errorCatechumens?.message}</Text>;

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
          value={householdSize}
          onChangeText={setHouseholdSize}
          keyboardType="numeric"
          style={styles.input}
        />
        <SearchPeople
          people={catechumensData.getCatechumens}
          onSelectionChange={setSelectedCatechumens}
          placeholder="Buscar catequizandos"
        />
      </View>
      <View style={styles.footer}>
      <Button onPress={() => router.back()}>Atrás</Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!selectedLocation || !householdSize}
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
