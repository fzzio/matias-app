import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { commonStyles } from '@/styles';
import LottieView from 'lottie-react-native';

export default function SurveyLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerLayout}>
        <LottieView
          source={require("@/assets/lottiefiles/1721342873275.json")}
          style={styles.headerLottieImage}
          autoPlay
          loop
        />
      </View>
      <Stack
        initialRouteName='step1'
        >
        <Stack.Screen name="step1" options={{ headerShown: false }} />
        <Stack.Screen name="step2" options={{ headerShown: false }} />
        <Stack.Screen name="step3" options={{ headerShown: false }} />
        <Stack.Screen name="step4" options={{ headerShown: false }} />
        <Stack.Screen name="step5" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  headerLottieImage: {
    width: 200,
    height: 200,
  },
  headerLayout: {
    alignItems: 'center',
    marginBottom: 8,
  },
});