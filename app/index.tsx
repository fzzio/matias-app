import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { commonStyles, buttonStyles } from '@/styles';
import { theme } from '@/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { syncManager } from '@/services/sync/syncManager';
import { clearSurvey } from '@/store/survey';

export default function Home() {
  const router = useRouter();
  const [surveysPending, setSurveysPending] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialDataSynced, setIsInitialDataSynced] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    loadPendingSurveys();
    checkInitialData();
    return () => unsubscribe();
  }, []);

  const checkInitialData = async () => {
    try {
      const [
        catechists,
        courses,
        catechumens,
        sacraments,
        catechismLevels,
        locations,
      ] = await Promise.all([
        AsyncStorage.getItem('catechists'),
        AsyncStorage.getItem('courses'),
        AsyncStorage.getItem('catechumens'),
        AsyncStorage.getItem('sacraments'),
        AsyncStorage.getItem('catechismLevels'),
        AsyncStorage.getItem('locations')
      ]);
      setIsInitialDataSynced(!!catechists && !!courses && !!catechumens && !!sacraments && !!catechismLevels && !!locations);
    } catch (error) {
      console.error('Error checking initial data:', error);
      setIsInitialDataSynced(false);
    }
  };

  const loadPendingSurveys = async () => {
    const surveysString = await AsyncStorage.getItem('pendingSurveys');
    const surveys = surveysString ? JSON.parse(surveysString) : [];
    setSurveysPending(surveys.length);
  };

  const syncData = async () => {
    setIsSyncing(true);
    if (!isConnected) {
      Alert.alert('Error', 'Sin conexión a internet.');
      setIsSyncing(false);
      return;
    }
    try {
      await syncManager();
      console.log('Surveys and other data synced');
      setSurveysPending(0);
      setIsInitialDataSynced(true);
      Alert.alert('Datos sincronizados');
    } catch (error) {
      console.error('Error syncing data:', error);
      Alert.alert('Error', 'Falló la sincronización. Por favor intente nuevamente.');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearLocalData = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Está seguro de que desea eliminar los datos pendientes? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['pendingSurveys', 'catechumensToUpdate']);
              clearSurvey();
              setSurveysPending(0);
              Alert.alert('Éxito', 'Los datos pendientes han sido eliminados.');
            } catch (error) {
              console.error('Error clearing local data:', error);
              Alert.alert('Error', 'No se pudieron eliminar los datos. Por favor, intente de nuevo.');
            }
          }
        }
      ]
    );
  };

  const clearAllLocalData = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Está seguro de que desea eliminar los datos pendientes? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'pendingSurveys',
                'catechumensToUpdate',
                'sacraments',
                'locations',
                'catechismLevels',
                'courses',
                'catechists',
                'catechumens',
                'catechumensTotal',
                'conductedSurveys',
              ]);
              clearSurvey();
              setSurveysPending(0);
              setIsInitialDataSynced(false);
              Alert.alert('Éxito', 'Los datos pendientes han sido eliminados.');
            } catch (error) {
              console.error('Error clearing local data:', error);
              Alert.alert('Error', 'No se pudieron eliminar los datos. Por favor, intente de nuevo.');
            }
          }
        }
      ]
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Parroquia "San José de Ancón"</Text>
          <Image source={require('@/assets/images/icon.png')} style={styles.headerImage} />
          <Text style={styles.subtitle}>Misión Catequética</Text>
          <Text style={styles.year}>2024</Text>
          <Text style={styles.version}>Version: 1.1.0</Text>
        </View>
        <View style={styles.buttonsContainer}>
          {!isInitialDataSynced && (
            <Text style={styles.syncMessage}>
              Por favor, sincronice los datos antes de usar la Encuesta o los Reportes.
            </Text>
          )}
          <Button
            icon={() => <Ionicons name="clipboard-outline" size={24} color={theme.colors.onPrimary} />}
            mode="contained"
            onPress={() => router.push('/survey')}
            style={!isSyncing && isInitialDataSynced ? buttonStyles.primaryButton : buttonStyles.disabledButton}
            labelStyle={isInitialDataSynced ? buttonStyles.primaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={isSyncing || !isInitialDataSynced}
          >
            Encuesta
          </Button>
          <Button
            icon={() => <Ionicons name="bar-chart-outline" size={24} color={theme.colors.primary} />}
            mode="outlined"
            onPress={() => router.push('/reports')}
            style={!isSyncing && isInitialDataSynced ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={isInitialDataSynced ? buttonStyles.secondaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={isSyncing || !isInitialDataSynced}
          >
            Reportes
          </Button>
          <Button
            icon={() => <Ionicons name="sync-outline" size={24} color={theme.colors.primary} />}
            mode="outlined"
            onPress={syncData}
            style={isConnected ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={isConnected ? buttonStyles.secondaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={!isConnected || isSyncing}
          >
            {isSyncing ? 'Sincronizando...' : !isConnected ? `Sin conexión (${surveysPending} pendientes)` : `Sincronizar (${surveysPending} pendientes)`}
          </Button>
          <Button
            icon={() => <Ionicons name="trash-outline" size={24} color={theme.colors.error} />}
            mode="outlined"
            onPress={clearLocalData}
            style={surveysPending > 0 ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={surveysPending > 0 ? [buttonStyles.secondaryButtonLabel, { color: theme.colors.error }] : buttonStyles.disabledButtonLabel}
            disabled={isSyncing || surveysPending === 0}
          >
            Borrar pendientes
          </Button>
          <Button
            icon={() => <Ionicons name="trash-outline" size={24} color={theme.colors.error} />}
            mode="outlined"
            onPress={clearAllLocalData}
            style={buttonStyles.secondaryButton}
          >
            Borrar Todo
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'center',
  },
  header: {
    ...commonStyles.header,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 32,
    justifyContent: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    flex: 1
  },
  title: {
    ...commonStyles.title,
    color: theme.colors.onPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onPrimary,
  },
  year: {
    ...commonStyles.bodyText,
    color: theme.colors.onPrimary,
    alignSelf: 'center',
  },
  version: {
    ...commonStyles.bodyText,
    color: theme.colors.onPrimary,
    alignSelf: 'center',
  },
  headerImage: {
    ...commonStyles.headerImage,
    marginVertical: 8,
    marginHorizontal: 'auto',
    alignSelf: 'center',
    verticalAlign: 'middle'
  },
  buttonsContainer: {
    ...commonStyles.buttonsContainer,
    gap: 16,
  },
  syncMessage: {
    ...commonStyles.bodyText,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
