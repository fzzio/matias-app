import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { SurveyStore, updateObservations } from "@/store/survey";
import { Pagination } from '@/components/Pagination';

export default function Step4() {
  const router = useRouter();
  const [observations, setObservations] = useState("");

  const handleSubmit = () => {
    console.log('Form submitted Step4');
    updateObservations(observations);
    router.push('/survey/step5');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={4} totalSteps={5} />
      <Text variant="headlineSmall">Ingrese sus observaciones</Text>
      <TextInput
        label="Observaciones"
        value={observations}
        onChangeText={setObservations}
        multiline
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.back()}>Atrás</Button>
        <Button mode="contained" onPress={handleSubmit}>Revisar</Button>
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
  headerLottieImage: {
    width: "100%",
    height: 200,
    marginBottom: 10
  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
