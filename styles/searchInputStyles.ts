import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const searchInputStyles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.onSurface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    elevation: 2,
    marginBottom: 5
  },
  listContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.onPrimary,
  },
});
