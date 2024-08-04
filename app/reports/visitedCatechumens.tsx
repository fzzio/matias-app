import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { commonStyles, buttonStyles } from '@/styles';
import { useCatechismLevels } from '@/hooks/useCatechismLevels';

export default function VisitedCatechumens() {
  const router = useRouter();
  const { loading, error, catechismLevels } = useCatechismLevels();

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Catequizandos Visitados</Text>
        </View>
        <View style={styles.body}>
          {catechismLevels.map((level) => (
            <Button
              key={level.id}
              mode="contained"
              onPress={() => router.push(`/reports/visitedCatechumens/${level.id}`)}
              style={buttonStyles.primaryButton}
              labelStyle={buttonStyles.primaryButtonLabel}
            >
              {level.name}
            </Button>
          ))}
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  body: {
    gap: 16,
  },
});
