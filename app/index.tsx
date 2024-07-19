import * as React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, Image, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { gql, useQuery } from '@apollo/client';


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
  const { loading, error, data } = useQuery(GET_CATECHISTS);
  const [selectedCatechists, setSelectedCatechists] = React.useState<Person[]>([]);

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Parroquia "San José de Ancón"</Text>
        <Image source={require('../assets/images/icon.png')} style={styles.headerImage}  />
        <Text variant="headlineLarge">Misión Catequética</Text>
        <Text variant="headlineMedium">2024</Text>
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
        <Link href="/step1" asChild>
          <Button
            mode="contained"
            style={styles.button}
            disabled={selectedCatechists.length === 0}
          >
            Empezar
          </Button>
        </Link>
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
  headerImage: {
    height: 200,
    width: 200,
    borderRadius: 10,
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