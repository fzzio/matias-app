import * as React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import LottieView from "lottie-react-native";
import { gql, useQuery } from '@apollo/client';


import { SearchPeople } from '@/components/SearchPeople';

interface Person {
  id: string;
  name: string;
  lastName: string;
}

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
      <LottieView
        source={require("../assets/lottiefiles/1720857631441.json")}
        style={{width: "100%", height: "50%"}}
        autoPlay
        loop
      />
      <View style={styles.header}>
        <Text variant="headlineLarge">Misión Catequética {(new Date().getFullYear())}</Text>
        <Text variant="headlineSmall">Fecha: {(new Date().toISOString().split('T')[0])}</Text>
      </View>
      <View style={styles.searchContainer}>
        <SearchPeople
          placeholder="Seleccionar catequistas"
          people={data.getCatechists}
          onSelectionChange={setSelectedCatechists}
        />
      </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
  },
  button: {
    marginTop: 20,
  },
});