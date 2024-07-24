import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { SurveyStore, updateObservations } from "@/store/survey";
import { Pagination } from '@/components/Pagination';
import LottieView from 'lottie-react-native';

export default function Step3() {
  const router = useRouter();
  const [observations, setObservations] = useState("");

  const handleSubmit = () => {
    console.log('Form submitted Step3');
    updateObservations(observations);
    router.push('/survey/step4');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={3} totalSteps={4} />
      <LottieView
        source={require("@/assets/lottiefiles/1720857631441.json")}
        style={styles.headerLottieImage}
        autoPlay
        loop
      />
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
