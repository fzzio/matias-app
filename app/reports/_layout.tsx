import { Stack } from 'expo-router';

export default function SurveyLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="report1" options={{ headerShown: false }} />
      <Stack.Screen name="report2" options={{ headerShown: false }} />
    </Stack>
  );
}
