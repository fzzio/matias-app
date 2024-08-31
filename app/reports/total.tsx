import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useSacraments } from '@/hooks/useSacraments';
import { useLocations } from '@/hooks/useLocations';
import { useCatechismLevels } from '@/hooks/useCatechismLevels';
import { useCatechumens } from '@/hooks/useCatechumens';
import { commonStyles, buttonStyles } from '@/styles';
import { Catechumen } from '@/types';
import { useRouter } from 'expo-router';

interface ChartDataItem {
  name: string;
  amount: number;
  total: number;
}

export default function TotalReports() {
  const router = useRouter();
  const { catechumens, catechumensTotal } = useCatechumens();
  const { locations } = useLocations();
  const { sacraments } = useSacraments();
  const { loading, error, catechismLevels } = useCatechismLevels();

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;


  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Reportes por Curso</Text>
        </View>
        <View style={styles.body}>
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
  },
});

