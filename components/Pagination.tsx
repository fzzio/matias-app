import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

interface PaginationProps {
  currentStep: number;
  totalSteps: number;
}

export function Pagination({ currentStep, totalSteps }: PaginationProps) {
  return (
    <View style={styles.container}>
      <ProgressBar progress={currentStep / totalSteps} style={styles.progressBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 10,
  },
});