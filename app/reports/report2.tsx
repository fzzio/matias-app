import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Report1() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reporte 1</Text>
      <Text>Aquí va el contenido del reporte 1.</Text>
      <Button mode="contained" style={styles.button} onPress={() => router.back()}>
        Volver
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: '80%',
  },
});
