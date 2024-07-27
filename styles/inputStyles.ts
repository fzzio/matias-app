import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const inputStyles = StyleSheet.create({
  defaultInput: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.onSurface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
  },
  outlineInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.roundness,
  }
});
