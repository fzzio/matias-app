import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechumen } from '@/types';
import { updateSelectedLocation, updateHouseholdSize, updateCatechumens } from "@/store/survey";
import { commonStyles, buttonStyles, inputStyles } from '@/styles';

export default function Step2() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [catechumens, setCatechumens] = useState<Catechumen[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [householdSize, setHouseholdSize] = useState('');
  const [selectedCatechumens, setSelectedCatechumens] = useState<Catechumen[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const storedLocations = await AsyncStorage.getItem('locations');
        const storedCatechumens = await AsyncStorage.getItem('catechumens');

        if (storedLocations) {
          setLocations(JSON.parse(storedLocations));
        } else {
          throw new Error('No locations found in local storage');
        }

        if (storedCatechumens) {
          setCatechumens(JSON.parse(storedCatechumens));
        } else {
          throw new Error('No catechumens found in local storage');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError('Failed to load data: ' + err.message);
        } else {
          setError('Failed to load data due to an unexpected error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNext = () => {
    console.log('Step 2... Done!: ');
    let householdSizeValue = parseInt(householdSize);
    if (selectedCatechumens.length > parseInt(householdSize) ) {
      householdSizeValue = selectedCatechumens.length;
    }
    updateHouseholdSize(householdSizeValue);
    updateSelectedLocation(selectedLocation);
    updateCatechumens(selectedCatechumens);
    router.push('/survey/step3');
  };

  const handleCatechumenSelectionChange = (selectedCatechumens: Catechumen[]) => {
    setSelectedCatechumens(selectedCatechumens);
  };

  if (isLoading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error}</Text>;

  const isFormValid = selectedLocation && householdSize !== '';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={2} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Información del Hogar</Text>
        </View>
        <View style={styles.body}>
          <SearchLocation
            locations={locations}
            onLocationSelect={setSelectedLocation}
            placeholder="Buscar ubicación"
          />
          <SearchPeople<Catechumen>
            people={catechumens}
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
            onPress={handleNext}
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
});
