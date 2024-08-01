import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Text, TextInput, Surface } from 'react-native-paper';
import { Pagination } from '@/components/Pagination';
import { updateObservations } from "@/store/survey";
import { commonStyles, buttonStyles, inputStyles } from '@/styles';

export default function Step4() {
  const router = useRouter();
  const [observations, setObservations] = useState("");

  const handleSubmit = () => {
    console.log('Step 4... Done!: ');
    updateObservations(observations);
    router.push('/survey/step5');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={commonStyles.surface}>
        <Pagination currentStep={4} totalSteps={5} />
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Observaciones</Text>
        </View>
        <View style={styles.body}>
          <Text style={commonStyles.subtitle}>Ingrese sus observaciones:</Text>
          <TextInput
            label="Observaciones"
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={4}
            style={[inputStyles.defaultInput, styles.textArea]}
          />
        </View>
        <View style={commonStyles.footerButtons}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
          >
            Revisar
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
  textArea: {
    height: 120,
  },
});
