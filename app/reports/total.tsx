import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { commonStyles, buttonStyles } from '@/styles';
import { useRouter } from 'expo-router';
import { useSurveys } from '@/hooks/useSurveys';

export default function TotalReports() {
  const router = useRouter();
  const { surveys } = useSurveys();


  const downloadAllSurveysAsExcel = () => {
    // TODO
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Reportes Totales</Text>
        </View>
        <View style={styles.body}>
          <Button
            mode="outlined"
            onPress={() => downloadAllSurveysAsExcel}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
          >
            Descargar Excel
          </Button>
        </View>
        <View style={styles.footer}>
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
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  body: {
    gap: 16,
    marginBottom: 5
  },
  footer: {
    gap: 16,
  },
});

