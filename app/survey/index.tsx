import * as React from 'react';
import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';
import { updateCatechists } from "@/store/survey";

import { SearchPeople } from '@/components/SearchPeople';
import { Person } from '@/types';

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

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge">Encuesta</Text>
      </View>
      <View style={styles.body}>
        <Text variant="labelMedium">Seleccione los catequistas que harán ésta visita:</Text>
        <SearchPeople
          placeholder="Buscar"
          people={data.getCatechists}
          onSelectionChange={setSelectedCatechists}
        />
      </View>
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={selectedCatechists.length === 0}
        >
          Empezar
        </Button>
        <Button
          mode="outlined"
          onPress={() => router.push('/')}
          style={styles.button}
        >
          Volver al Menú Principal
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: "#cccccc",
  },
  header: {
    alignItems: 'center',
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  body: {
    flexDirection: "column",
    gap: 8,
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 16
  },
  footer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8
  },
  button: {
    marginTop: 20,
  },
});
