import * as React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Chip, List, Searchbar, Text } from 'react-native-paper';
import LottieView from "lottie-react-native";


export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');

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
      <View style={styles.peopleContainer}>
        <Searchbar
          placeholder="Buscar catequistas"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.peopleList}>
          <List.Section>
            <List.Item
              title="Catequista 1"
            />
            <List.Item
              title="Catequista 2"
            />
          </List.Section>
        </View>
        <View style={styles.peopleChips}>
          <Chip onClose={() => console.log('Closed')}>Catequista 1</Chip>
          <Chip onClose={() => console.log('Closed')}>Catequista 2</Chip>
        </View>
      </View>
      <Link href="/step1" asChild>
        <Button mode="contained" style={styles.button}>Empezar</Button>
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
    marginBottom: 10
  },
  button: {
    marginTop: 20,
  },
  peopleContainer: {
    flexDirection: "column",
    flexWrap: 'wrap',
  },
  peopleList: {
    flexDirection: "column",
    flexWrap: 'wrap',
  },
  peopleChips: {
    flexDirection: "row",
    flexWrap: 'wrap',
    gap: 8
  },
  searchBar: {}
});