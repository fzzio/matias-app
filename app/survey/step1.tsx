import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { updateCatechists, updateSelectedLocation } from "@/store/survey";
import { SearchPeople } from '@/components/SearchPeople';
import { Location, Catechist} from '@/types';
import { theme } from '@/styles/theme';
import { commonStyles, buttonStyles } from '@/styles';
import { Pagination } from '@/components/Pagination';
import { SearchLocation } from '@/components/SearchLocation';
import { jsonToCatechist } from '@/utils/catechistUtils';

export default function Step1() {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [catechists, setCatechists] = useState<Catechist[]>([]);
  const [selectedCatechists, setSelectedCatechists] = useState<Catechist[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatechists = async () => {
      try {
        const storedLocations = await AsyncStorage.getItem('locations');
        const storedCatechists = await AsyncStorage.getItem('catechists');

        if (storedLocations) {
          setLocations(JSON.parse(storedLocations));
        } else {
          throw new Error('No locations found in local storage');
        }

        if (storedCatechists) {
          setCatechists(JSON.parse(storedCatechists).map(jsonToCatechist));
        } else {
          throw new Error('No catechists found in local storage');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError('Failed to load catechists: ' + err.message);
        } else {
          setError('Failed to load catechists due to an unexpected error');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCatechists();
  }, []);

  const handleNext = () => {
    console.log('Step 1... Done!: ');
    updateSelectedLocation(selectedLocation);
    updateCatechists(selectedCatechists);
    router.push('/survey/step2');
  };

  const handleCatechistSelectionChange = (selectedCatechists: Catechist[]) => {
    setSelectedCatechists(selectedCatechists);
  };

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error}</Text>;

  const isFormValid = selectedLocation !== null && selectedCatechists.length > 0;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
    >
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={1} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Encuesta</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.subtitle}>Seleccione datos de la visita:</Text>
          <SearchLocation
            locations={locations}
            onLocationSelect={setSelectedLocation}
            placeholder="Buscar ubicación"
          />
          <SearchPeople<Catechist>
            placeholder="Buscar catequistas"
            people={catechists}
            onSelectionChange={handleCatechistSelectionChange}
            personType='Catechist'
            style={styles.searchPeople}
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
    </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
});
