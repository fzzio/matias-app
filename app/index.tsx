import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { commonStyles, buttonStyles } from '@/styles';
import { theme } from '@/styles/theme';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parroquia "San José de Ancón"</Text>
        <Image source={require('@/assets/images/icon.png')} style={styles.headerImage} />
        <Text style={styles.subtitle}>Misión Catequética</Text>
        <Text style={styles.year}>2024</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          icon={() => <Ionicons name="clipboard-outline" size={24} color={theme.colors.onPrimary} />}
          mode="contained"
          onPress={() => router.push('/survey')}
          style={buttonStyles.primaryButton}
          labelStyle={buttonStyles.primaryButtonLabel}
        >
          Encuesta
        </Button>
        <Button
          icon={() => <Ionicons name="bar-chart-outline" size={24} color={theme.colors.primary} />}
          mode="outlined"
          onPress={() => router.push('/reports')}
          style={buttonStyles.secondaryButton}
          labelStyle={buttonStyles.secondaryButtonLabel}
        >
          Reportes
        </Button>
        <Button
          icon={() => <Ionicons name="sync-outline" size={24} color={theme.colors.primary} />}
          mode="outlined"
          onPress={() => router.push('/')}
          style={buttonStyles.secondaryButton}
          labelStyle={buttonStyles.secondaryButtonLabel}
        >
          Sincronizar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: 'center',
  },
  header: {
    ...commonStyles.header,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    padding: 24,
    marginBottom: 32,
  },
  title: {
    ...commonStyles.title,
    color: theme.colors.onPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onPrimary,
  },
  year: {
    ...commonStyles.bodyText,
    color: theme.colors.onPrimary,
  },
  headerImage: {
    ...commonStyles.headerImage,
    marginVertical: 16,
  },
  buttonsContainer: {
    ...commonStyles.buttonsContainer,
    gap: 16,
  },
});
