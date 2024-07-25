import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
    elevation: 2,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonLabel: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.onSurface,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.roundness,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  disabledButtonLabel: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
