import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button, Text, TextInput } from 'react-native-paper';
import { useQuery, gql } from '@apollo/client';
import LottieView from "lottie-react-native";

import { Pagination } from '@/components/Pagination';
import { Location, Catechizand } from '@/types';


export default function Step1() {
  const router = useRouter();
  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted');
    router.push('/step3');
  };

  return (
    <View style={styles.container}>
      <Pagination currentStep={2} totalSteps={3} />
      <LottieView
        source={require("../assets/lottiefiles/1720857631441.json")}
        style={styles.headerLottieImage}
        autoPlay
        loop
      />
      <View style={styles.header}>
        <Text variant="headlineMedium">Información por persona</Text>
      </View>
      <View style={styles.body}>
        {/* TODO */}
      </View>
      <View style={styles.footer}>
      <Button onPress={() => router.back()}>Atrás</Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: "column",
    alignContent: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  headerLottieImage: {
    width: "100%",
    height: "20%",
    marginBottom: 10
  },
  body: {
    flexDirection: "column",
    gap: 16,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 16
  },
  input: {
    backgroundColor: "#FFFFFF"
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});