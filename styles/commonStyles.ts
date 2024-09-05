import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    color: theme.colors.onBackground,
    lineHeight: 24,
    flexWrap: 'wrap'
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    color: theme.colors.secondary,
  },
  footerButtons: {
    gap: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerTitle: {
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 4,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  buttonsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  surface: {
    padding: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    elevation: 4,
  },
  loadingText: {
    color: theme.colors.onBackground,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  errorText: {
    color: theme.colors.error,
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 20,
    textAlign: 'center',
    verticalAlign: 'middle',
  }
});
