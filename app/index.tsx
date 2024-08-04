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
      const [catechists, catechumens, locations] = await Promise.all([
        AsyncStorage.getItem('catechists'),
        AsyncStorage.getItem('catechumens'),
        AsyncStorage.getItem('locations')
      ]);
      setIsInitialDataSynced(!!catechists && !!catechumens && !!locations);
    } catch (error) {
      console.error('Error checking initial data:', error);
      setIsInitialDataSynced(false);
    }
  };

  const loadPendingSurveys = async () => {
    const surveysString = await AsyncStorage.getItem('surveys');
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
      "¿Está seguro de que desea eliminar todos los datos locales? Esta acción no se puede deshacer.",
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
                'surveys',
                'catechists',
                'catechumens',
                'locations'
              ]);
              clearSurvey();
              setSurveysPending(0);
              setIsInitialDataSynced(false);
              Alert.alert('Éxito', 'Todos los datos locales han sido eliminados.');
            } catch (error) {
              console.error('Error clearing local data:', error);
              Alert.alert('Error', 'No se pudieron eliminar los datos locales. Por favor, intente de nuevo.');
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
            style={isInitialDataSynced ? buttonStyles.primaryButton : buttonStyles.disabledButton}
            labelStyle={isInitialDataSynced ? buttonStyles.primaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={!isInitialDataSynced}
          >
            Encuesta
          </Button>
          <Button
            icon={() => <Ionicons name="bar-chart-outline" size={24} color={theme.colors.primary} />}
            mode="outlined"
            onPress={() => router.push('/reports')}
            style={isInitialDataSynced ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={isInitialDataSynced ? buttonStyles.secondaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={!isInitialDataSynced}
          >
            Reportes
          </Button>
          <Button
            icon={() => <Ionicons name="sync-outline" size={24} color={theme.colors.primary} />}
            mode="outlined"
            onPress={syncData}
            style={!isSyncing ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={!isSyncing ? buttonStyles.secondaryButtonLabel : buttonStyles.disabledButtonLabel}
            disabled={!isConnected || isSyncing}
          >
            {isSyncing ? 'Sincronizando...' : `Sincronizar (${surveysPending} pendientes)`}
          </Button>
          <Button
            icon={() => <Ionicons name="trash-outline" size={24} color={theme.colors.error} />}
            mode="outlined"
            onPress={clearLocalData}
            style={isInitialDataSynced ? buttonStyles.secondaryButton : buttonStyles.disabledButton}
            labelStyle={isInitialDataSynced ? [buttonStyles.secondaryButtonLabel, { color: theme.colors.error }] : buttonStyles.disabledButtonLabel}
            disabled={!isInitialDataSynced}
          >
            Limpiar
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
    padding: 24,
    marginBottom: 32,
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
  },
  headerImage: {
    ...commonStyles.headerImage,
    marginVertical: 16,
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
