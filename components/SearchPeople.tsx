import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Searchbar, List, Chip, SearchbarProps, Icon } from 'react-native-paper';
import { Person } from '@/types';
import { searchInputStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface SearchPeopleProps extends Omit<SearchbarProps, 'onChangeText' | 'value' | 'onSelectionChange'> {
  people: Person[];
  onSelectionChange: (selectedPeople: Person[]) => void;
  style?: ViewStyle;
}

export function SearchPeople({
  people,
  onSelectionChange,
  style,
  ...searchBarProps
}: SearchPeopleProps) {
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
    const newSelectedPeople = [...selectedPeople, person];
    setSelectedPeople(newSelectedPeople);
    onSelectionChange(newSelectedPeople);
    setSearchQuery('');
  };

  const handleRemove = (person: Person) => {
    const newSelectedPeople = selectedPeople.filter(p => p.id !== person.id);
    setSelectedPeople(newSelectedPeople);
    onSelectionChange(newSelectedPeople);
  };

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={searchInputStyles.input}
        {...searchBarProps}
      />
      {searchQuery.trim() !== '' && (
        <List.Section style={searchInputStyles.listContainer}>
          {filteredPeople.map(person => (
            <List.Item
              key={person.id}
              title={`${person.name} ${person.lastName}`}
              onPress={() => handleSelect(person)}
              style={searchInputStyles.listItem}
            />
          ))}
        </List.Section>
      )}
      <View style={searchInputStyles.chipsContainer}>
        {selectedPeople.map(person => (
          <Chip
            key={person.id}
            onClose={() => handleRemove(person)}
            style={searchInputStyles.chip}
            textStyle={searchInputStyles.chipText}
            closeIcon={props => <Icon source={"close"} {...props} color={theme.colors.onPrimary} />}
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
});
