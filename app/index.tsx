import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Parroquia "San José de Ancón"</Text>
        <Image source={require('@/assets/images/icon.png')} style={styles.headerImage}  />
        <Text variant="headlineLarge">Misión Catequética</Text>
        <Text variant="headlineMedium">2024</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          icon={() => <Ionicons name="clipboard-outline" size={24} />}
          mode="contained"
          onPress={() => router.push('/survey')}
          style={styles.button}
        >
          Encuesta
        </Button>
        <Button
          icon={() => <Ionicons name="bar-chart-outline" size={24} />}
          mode="contained"
          onPress={() => router.push('/reports')}
          style={styles.button}
        >
          Reportes
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
  header: {
    alignItems: 'center',
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  headerImage: {
    height: 200,
    width: 200,
    borderRadius: 10,
    marginBottom: 16
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
