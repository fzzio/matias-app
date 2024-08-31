import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { commonStyles } from '@/styles';
import LottieView from 'lottie-react-native';

export default function ReportsLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerLayout}>
          <LottieView
            source={require("@/assets/lottiefiles/1721342873275.json")}
            style={styles.headerLottieImage}
            autoPlay
            loop
          />
        </View>
        <Stack initialRouteName='index'>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="byCourse" options={{ headerShown: false }} />
          <Stack.Screen name="total" options={{ headerShown: false }} />
          <Stack.Screen name="visitedCatechumens/[id]" options={{ headerShown: false }} />
        </Stack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonStyles.container.backgroundColor,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerLayout: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLottieImage: {
    width: 130,
    height: 130,
  },
});
