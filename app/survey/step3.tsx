import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native-paper';
import { Pagination } from '@/components/Pagination';
import { PersonForm } from '@/components/PersonForm';
import CatechumenInfo from '@/components/CatechumenInfo';
import { Catechumen, PersonInput } from '@/types';
import { SurveyStore, updateCatechumenData, updatePeople } from "@/store/survey";
import { useSacraments } from '@/hooks/useSacraments';
import { commonStyles, buttonStyles } from '@/styles';

export default function Step3() {
  const router = useRouter();
  const { householdSize, catechumens } = SurveyStore.useState();
  const { loading, error, sacraments } = useSacraments();
  const [people, setPeople] = useState<PersonInput[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const additionalPeopleCount = householdSize - catechumens.length;
    const initialPeople: PersonInput[] = Array.from({ length: additionalPeopleCount }).map(() => ({
      name: "",
      lastName: "",
      birthDate: undefined,
      sacraments: [],
      missingSacraments: [],
      isVolunteer: false
    }));

    setPeople(initialPeople);
  }, [householdSize, catechumens.length]);

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

  const handleSubmit = async () => {
    console.log('Step 3... Done!: ');
    updatePeople(people);
    router.push('/survey/step4');
  };

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Pagination currentStep={3} totalSteps={5} />
      <View style={commonStyles.headerTitle}>
        <Text style={commonStyles.title}>Información por persona</Text>
      </View>
      <View style={styles.body}>
        {catechumens.map((catechumen, indexC) => (
          <CatechumenInfo
            key={indexC}
            catechumen={catechumen}
            editable={true}
            onUpdate={(updatedCatechumen: Catechumen) => {
              updateCatechumenData(updatedCatechumen);
            }}
          />
        ))}
        {people.map((person, indexP) => (
          <PersonForm
            key={indexP}
            person={person}
            index={indexP}
            sacraments={sacraments}
            updatePerson={(indexP, field, value) => {
              const newPeople = [...people];
              newPeople[indexP] = { ...newPeople[indexP], [field]: value };
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
    marginBottom: 24,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
});
