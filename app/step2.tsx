import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { Button, Text, TextInput, Checkbox } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import LottieView from "lottie-react-native";

import { Pagination } from '@/components/Pagination';
import { Catechizand } from '@/types';

const GET_SACRAMENTS = gql`
  query GetSacraments {
    getSacraments {
      id
      name
    }
  }
`;

interface PersonForm {
  name: string;
  sacraments: string[];
}

export default function Step2() {
  const router = useRouter();
  const { peopleCount, selectedCatechizands } = useLocalSearchParams<{ peopleCount: string, selectedCatechizands: string }>();
  const [people, setPeople] = useState<PersonForm[]>([]);

  const { loading, error, data } = useQuery(GET_SACRAMENTS);

  useEffect(() => {
    if (peopleCount && selectedCatechizands) {
      const count = parseInt(peopleCount);
      const catechizands: Catechizand[] = JSON.parse(selectedCatechizands);

      const initialPeople: PersonForm[] = Array(count).fill(null).map((_, index) => {
        if (index < catechizands.length) {
          return { name: `${catechizands[index].name} ${catechizands[index].lastName}`, sacraments: [] };
        } else {
          return { name: `Persona ${index + 1}`, sacraments: [] };
        }
      });

      setPeople(initialPeople);
    }
  }, [peopleCount, selectedCatechizands]);

  const handleNameChange = (index: number, name: string) => {
    const newPeople = [...people];
    newPeople[index].name = name;
    setPeople(newPeople);
  };

  const handleSacramentToggle = (personIndex: number, sacramentId: string) => {
    const newPeople = [...people];
    const sacraments = newPeople[personIndex].sacraments;
    const sacramentIndex = sacraments.indexOf(sacramentId);

    if (sacramentIndex > -1) {
      sacraments.splice(sacramentIndex, 1);
    } else {
      sacraments.push(sacramentId);
    }

    setPeople(newPeople);
  };

  const handleSubmit = () => {
    console.log('Form submitted', people);
    router.push('/step3');
  };

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Pagination currentStep={2} totalSteps={3} />
      <LottieView
        source={require("../assets/lottiefiles/1720857631441.json")}
        style={styles.headerLottieImage}
        autoPlay
        loop
      />
      <View style={styles.header}>
        <Text variant="headlineMedium">Información por persona</Text>
      </View>
      <View style={styles.body}>
        {people.map((person, index) => (
          <View key={index} style={styles.personForm}>
            <TextInput
              label={`Nombre de la persona ${index + 1}`}
              value={person.name}
              onChangeText={(text) => handleNameChange(index, text)}
              style={styles.input}
            />
            <Text style={styles.sacramentTitle}>Sacramentos:</Text>
            {data.getSacraments.map((sacrament: { id: string, name: string }) => (
              <Checkbox.Item
                key={sacrament.id}
                label={sacrament.name}
                status={person.sacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
                onPress={() => handleSacramentToggle(index, sacrament.id)}
                style={styles.checkbox}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Button onPress={() => router.back()}>Atrás</Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
        >
          Continuar
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
    height: 200,
    marginBottom: 10
  },
  body: {
    flexDirection: "column",
    gap: 16,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 16
  },
  personForm: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: "100%"
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  checkbox: {
    width: "100%",
  },
  sacramentTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
});