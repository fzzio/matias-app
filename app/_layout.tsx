import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/client';
import client from '@/apollo-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="step1" options={{ headerShown: false }} />
          <Stack.Screen name="step2" options={{ headerShown: false }} />
          <Stack.Screen name="step3" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </ApolloProvider>
  );
}
