import * as React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';
import { updateCatechists } from "@/store/survey";
import { SearchPeople } from '@/components/SearchPeople';
import { Person } from '@/types';
import { theme } from '@/styles/theme';
import { commonStyles, buttonStyles } from '@/styles';
import LottieView from 'lottie-react-native';

const GET_CATECHISTS = gql`
  query GetCatechists {
    getCatechists {
      id
      name
      lastName
    }
  }
`;

export default function Home() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_CATECHISTS);
  const [selectedCatechists, setSelectedCatechists] = React.useState<Person[]>([]);

  const handleSubmit = () => {
    console.log('Form submitted index', { selectedCatechists });
    updateCatechists(selectedCatechists);
    router.push('/survey/step1');
  };

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.header}>
          <Text style={styles.title}>Encuesta</Text>
          <LottieView
            source={require("@/assets/lottiefiles/1721342873275.json")}
            style={styles.headerLottieImage}
            autoPlay
            loop
          />
        </View>
        <View style={styles.body}>
          <Text style={styles.subtitle}>Seleccione los catequistas que harán ésta visita:</Text>
          <SearchPeople
            placeholder="Buscar catequistas"
            people={data.getCatechists}
            onSelectionChange={setSelectedCatechists}
            style={styles.searchPeople}
          />
        </View>
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={selectedCatechists.length === 0 ? buttonStyles.disabledButton : buttonStyles.primaryButton}
            labelStyle={selectedCatechists.length === 0 ? buttonStyles.disabledButtonLabel : buttonStyles.primaryButtonLabel}
            disabled={selectedCatechists.length === 0}
          >
            Empezar
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/')}
            style={buttonStyles.secondaryButton}
            labelStyle={buttonStyles.secondaryButtonLabel}
          >
            Volver al Menú Principal
          </Button>
        </View>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  surface: {
    padding: 24,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...commonStyles.title,
    marginBottom: 16,
  },
  headerLottieImage: {
    width: 200,
    height: 200,
  },
  body: {
    gap: 16,
  },
  subtitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onSurface,
  },
  footer: {
    marginTop: 24,
    gap: 16,
  },
  searchPeople: {
    marginBottom: 10,
  },
});
