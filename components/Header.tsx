import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { commonStyles } from '@/styles';
import { theme } from '@/styles/theme';

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Parroquia "San José de Ancón"</Text>
    <Image source={require('@/assets/images/icon.png')} style={styles.headerImage} />
    <Text style={styles.subtitle}>Misión Catequética</Text>
    <Text style={styles.year}>2024</Text>
    <Text style={styles.version}>Version: 1.1.0</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    alignItems: 'center',
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 32,
    marginTop: 32,
  },
  title: {
    ...commonStyles.title,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    width: '100%',
  },
  year: {
    ...commonStyles.bodyText,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    width: '100%',
  },
  version: {
    ...commonStyles.bodyText,
    color: theme.colors.onPrimary,
    textAlign: 'center',
    width: '100%',
  },
  headerImage: {
    marginVertical: 8,
    alignSelf: 'center',
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
});

export default Header;