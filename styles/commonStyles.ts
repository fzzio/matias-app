import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: theme.colors.secondary,
  },
  header: {
    alignItems: 'center',
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
    backgroundColor: theme.colors.primary,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.onPrimary,
    marginBottom: 8,
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  headerImage: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    lineHeight: 24,
    flex: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 20,
  }
});
