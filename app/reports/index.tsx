import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { commonStyles, buttonStyles } from '@/styles';

export default function ReportsIndex() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Menú de Reportes</Text>
        </View>
        <View style={styles.body}>
          <Button
            mode="contained"
            onPress={() => router.push('/reports/visitedCatechumens')}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
          >
            Catequizandos visitados
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  body: {
    gap: 16,
  },
});
