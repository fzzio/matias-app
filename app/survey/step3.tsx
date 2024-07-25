import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Surface, Text } from 'react-native-paper';
import { Pagination } from '@/components/Pagination';
import { PersonForm } from '@/components/PersonForm';
import { PersonInput } from '@/types';
import { SurveyStore, updateCatechumens, updateOtherPeople } from "@/store/survey";
import { useSacraments } from '@/hooks/useSacraments';
import { commonStyles, buttonStyles } from '@/styles';

export default function Step2() {
  const router = useRouter();
  const { householdSize, catechumens } = SurveyStore.useState();
  const { loading, error, sacraments } = useSacraments();
  const [people, setPeople] = useState<PersonInput[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const initialPeople: PersonInput[] = Array.from({ length: householdSize }).map((_, index) => {
      if (index < catechumens.length) {
        const { id, idCard, name, lastName, birthDate, sacraments: sacramentsArray, isVolunteer } = catechumens[index];
        return { id, idCard, name, lastName, birthDate, sacraments: sacramentsArray.map((sacramentId: string) => sacramentId), isVolunteer: isVolunteer !== undefined ? isVolunteer : false };
      } else {
        return { name: "", lastName: "", sacraments: [], isVolunteer: false };
      }
    });
    setPeople(initialPeople);
  }, [householdSize, catechumens]);

  useEffect(() => {
    validateForm();
  }, [people]);

  const validateForm = () => {
    const isValid = people.every(person =>
      person.name.trim() !== "" &&
      person.lastName.trim() !== "" &&
      person.birthDate !== undefined &&
      person.isVolunteer !== undefined
    );
    setIsFormValid(isValid);
  };

  const handleSubmit = () => {
    console.log('Form submitted Step2');
    const newCatechumens = people.filter(person => person.id !== undefined) as PersonInput[];
    const newOtherPeople = people.filter(person => person.id === undefined);
    updateCatechumens(newCatechumens);
    updateOtherPeople(newOtherPeople);
    router.push('/survey/step3');
  };

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView style={styles.container}>
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={3} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Información por persona</Text>
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
              style={{ marginBottom: 20 }}
            />
          ))}
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
    </ScrollView>
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
