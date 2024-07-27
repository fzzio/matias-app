import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { commonStyles } from '@/styles';
import LottieView from 'lottie-react-native';

export default function SurveyLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerLayout}>
            <LottieView
              source={require("@/assets/lottiefiles/1720857631441.json")}
              style={styles.headerLottieImage}
              autoPlay
              loop
            />
          </View>
          <Stack initialRouteName='step1'>
            <Stack.Screen name="step1" options={{ headerShown: false }} />
            <Stack.Screen name="step2" options={{ headerShown: false }} />
            <Stack.Screen name="step3" options={{ headerShown: false }} />
            <Stack.Screen name="step4" options={{ headerShown: false }} />
            <Stack.Screen name="step5" options={{ headerShown: false }} />
          </Stack>
        </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  headerLayout: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLottieImage: {
    width: 180,
    height: 180,
  },
});
