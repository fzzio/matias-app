import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { Pagination } from '@/components/Pagination';

export default function Step3() {
  const router = useRouter();

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted');
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={2} totalSteps={3} />
      <Text variant="headlineMedium">Step 3</Text>
      <TextInput
        label="Phone"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.back()}>Back</Button>
        <Button mode="contained" onPress={handleSubmit}>Finish</Button>
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