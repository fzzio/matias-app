import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import { Pagination } from '@/components/Pagination';

export default function Step2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pagination currentStep={2} totalSteps={3} />
      <Text variant="headlineMedium">Step 2</Text>
      <TextInput
        label="Email"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button onPress={() => router.back()}>Back</Button>
        <Link href="/step3" asChild>
          <Button mode="contained">Continue</Button>
        </Link>
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