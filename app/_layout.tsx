import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { ApolloProvider } from '@apollo/client';
import client from '@/apollo-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#8b0000',
      onPrimary: '#ffffff',
      secondary: '#ffc107',
      onSecondary: '#000000',
      background: '#ffffff',
      onBackground: '#333333',
      surface: '#ffffff',
      onSurface: '#333333',
      error: '#B00020',
      onError: '#ffffff',
    },
    typography: {
      bodyLarge: {
        fontFamily: 'Roboto',
        fontWeight: '400',
      },
      titleLarge: {
        fontFamily: 'Roboto',
        fontWeight: '500',
      },
    },
  };

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
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="survey" options={{ headerShown: false }} />
          <Stack.Screen name="reports" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </ApolloProvider>
  );
}