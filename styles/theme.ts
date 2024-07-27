import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5D1049',
    onPrimary: '#FFFFFF',
    secondary: '#E30425',
    onSecondary: '#FFFFFF',
    background: '#FAFAFA',
    onBackground: '#1A1C18',
    surface: '#FFFFFF',
    onSurface: '#1A1C18',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    accent: '#FFC107',
    disabled: '#CCCCCC',
    onDisabled: '#666666',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100',
    },
  },
  roundness: 8,
};