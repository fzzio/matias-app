import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ReportsIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Menú de Reportes</Text>
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/reports/report1')}
          style={styles.button}
        >
          Reporte 1
        </Button>
        <Button
          mode="contained"
          onPress={() => router.push('/reports/report2')}
          style={styles.button}
        >
          Reporte 2
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('/')}
          style={styles.button}
        >
          Volver al Menú Principal
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    width: '80%',
  },
});
