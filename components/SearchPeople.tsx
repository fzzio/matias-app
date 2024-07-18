import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, List, Chip } from 'react-native-paper';

interface Person {
  id: string;
  name: string;
  lastName: string;
}

interface SearchPeopleProps {
  people: Person[];
  onSelectionChange: React.Dispatch<React.SetStateAction<Person[]>>;
  placeholder?: string;
}

export function SearchPeople({ people, onSelectionChange, placeholder = "Search people"  }: SearchPeopleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPeople([]);
    } else {
      const filtered = people.filter(
        person =>
          !selectedPeople.some(selected => selected.id === person.id) &&
          (person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPeople(filtered);
    }
  }, [searchQuery, people, selectedPeople]);

  const handleSelect = (person: Person) => {
    onSelectionChange(prev => [...prev, person]);
    setSelectedPeople(prev => [...prev, person]);
    setSearchQuery('');
  };

  const handleRemove = (person: Person) => {
    onSelectionChange(prev => prev.filter(p => p.id !== person.id));
    setSelectedPeople(prev => prev.filter(p => p.id !== person.id));
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {searchQuery.trim() !== '' && (
        <List.Section style={styles.listContainer}>
          {filteredPeople.map(person => (
            <List.Item
              key={person.id}
              title={`${person.name} ${person.lastName}`}
              onPress={() => handleSelect(person)}
              style={styles.listItem}
            />
          ))}
        </List.Section>
      )}
      <View style={styles.chipsContainer}>
        {selectedPeople.map(person => (
          <Chip
            key={person.id}
            onClose={() => handleRemove(person)}
            style={styles.chip}
          >
            {`${person.name} ${person.lastName}`}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    backgroundColor: "#FFFFFF"
  },
  listContainer: {
    backgroundColor: "#FFFFFF"
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000"
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8
  },
  chip: {
    backgroundColor: "#FFFFFF"
  },
});