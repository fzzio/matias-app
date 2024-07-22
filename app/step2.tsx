import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button, Text } from 'react-native-paper';

import { Pagination } from '@/components/Pagination';
import { PersonForm } from '@/components/PersonForm';
import { PersonInput, Catechumen, Sacrament } from '@/types';
import { SurveyStore, updateCatechumens, updateOtherPeople } from "@/store/survey";
import { useSacraments } from '@/hooks/useSacraments';
import LottieView from 'lottie-react-native';

export default function Step2() {
  const router = useRouter();
  const { householdSize, catechumens } = SurveyStore.useState();
  const { loading, error, sacraments } = useSacraments();
  const [people, setPeople] = useState<PersonInput[]>([]);

  useEffect(() => {
    const initialPeople: PersonInput[] = Array.from({ length: householdSize }).map((_, index) => {
      if (index < catechumens.length) {
        const { id, idCard, name, lastName, birthDate, sacraments: sacramentsArray } = catechumens[index];
        return { id, idCard, name, lastName, birthDate, sacraments: sacramentsArray.map((sacramentId: string) => sacramentId), isVolunteer: false };
      } else {
        return { name: "", lastName: "", sacraments: [], isVolunteer: false };
      }
    });
    setPeople(initialPeople);
  }, [householdSize, catechumens]);

  const handleSubmit = () => {
    console.log('Form submitted Step2');
    const newCatechumens = people.filter(person => person.id !== undefined) as PersonInput[];
    const newOtherPeople = people.filter(person => person.id === undefined);
    updateCatechumens(newCatechumens);
    updateOtherPeople(newOtherPeople);
    router.push('/step3');
  };

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text>householdSize = {householdSize}</Text>
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
          <PersonForm
            key={index}
            person={person}
            index={index}
            sacraments={sacraments}
            updatePerson={(index, field, value) => {
              const newPeople = [...people];
              newPeople[index] = { ...newPeople[index], [field]: value };
              setPeople(newPeople);
            }}
          />
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
});
