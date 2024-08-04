import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buttonStyles, commonStyles } from '@/styles';
import { useCatechismLevels } from '@/hooks/useCatechismLevels';

export default function CatechismLevelDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { catechismLevels, getCatechismLevelNameById } = useCatechismLevels();

  const levelName = getCatechismLevelNameById(id as string);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>{levelName}</Text>
        </View>
        <View style={styles.body}>
          <Text style={commonStyles.bodyText}>Detalles del nivel de catecismo: {levelName}</Text>
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
