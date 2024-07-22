import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { SurveyStore, updateObservations } from "@/store/survey";
import { Pagination } from '@/components/Pagination';

export default function Step3() {
  const router = useRouter();
  const [observations, setObservations] = useState("");

  const handleSubmit = () => {
    console.log('Form submitted Step3');
    updateObservations(observations);
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={3} totalSteps={3} />
      <Text variant="headlineMedium">Observaciones</Text>
      <TextInput
        label="Observaciones"
        value={observations}
        onChangeText={setObservations}
        multiline
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.back()}>Atrás</Button>
        <Button mode="contained" onPress={handleSubmit}>Finalizar</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});