import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { commonStyles, buttonStyles } from '@/styles';

export default function Report1() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Reporte 1</Text>
        </View>
        <View style={styles.body}>
          <Text>Aquí va el contenido del reporte 1.</Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
          >
            Volver
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
