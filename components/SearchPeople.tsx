import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Searchbar, List, Chip, SearchbarProps, Icon } from 'react-native-paper';
import { Person, Catechist, Catechumen, Course } from '@/types';
import { searchInputStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface SearchPeopleProps<T extends Partial<Person>> extends Omit<SearchbarProps, 'onChangeText' | 'value' | 'onSelectionChange'> {
  people: T[];
  onSelectionChange: (selectedPeople: T[]) => void;
  personType?: 'Person' | 'Catechist' | 'Catechumen';
  style?: ViewStyle;
}

export function SearchPeople<T extends Partial<Person>>({
  people,
  onSelectionChange,
  personType,
  style,
  ...searchBarProps
}: SearchPeopleProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<T[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<T[]>([]);

  useEffect(() => {
    const filtered = filterPeople(people, searchQuery, selectedPeople);
    setFilteredPeople(sortPeople(filtered));
  }, [searchQuery, people, selectedPeople]);

  const filterPeople = (people: T[], query: string, selected: T[]): T[] => {
    if (query.trim() === '') return [];

    return people.filter(person =>
      !selected.some(selectedPerson => selectedPerson.id === person.id) &&
      (person.name?.toLowerCase().includes(query.toLowerCase()) || person.lastName?.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const sortPeople = (people: T[]): T[] => {
    return people.sort((a, b) => `${a.lastName} ${a.name}`.localeCompare(`${b.lastName} ${b.name}`));
  };

  const handleSelect = (person: T) => {
    const newSelectedPeople = [...selectedPeople, person];
    setSelectedPeople(sortPeople(newSelectedPeople));
    onSelectionChange(newSelectedPeople);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleRemove = (person: T) => {
    const newSelectedPeople = selectedPeople.filter(p => p.id !== person.id);
    setSelectedPeople(newSelectedPeople);
    onSelectionChange(newSelectedPeople);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, style]}
    >
      <Searchbar
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={searchInputStyles.input}
        {...searchBarProps}
      />
      {searchQuery.trim() !== '' && (
        <ScrollView style={styles.scrollView}>
          <List.Section style={searchInputStyles.listContainer}>
            {filteredPeople.map(person => (
              <List.Item
                key={person.id}
                title={`${person.lastName} ${person.name}`}
                onPress={() => handleSelect(person)}
                style={searchInputStyles.listItem}
              />
            ))}
          </List.Section>
        </ScrollView>
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
            {getChipLabel(person, personType)}
          </Chip>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollView: {
    maxHeight: 200
  },
});

function getChipLabel<T extends Partial<Person>>(person: T, personType?: 'Person' | 'Catechist' | 'Catechumen'): string {
  let label = `${person.lastName} ${person.name}`;

  if (personType === 'Catechist' && 'coursesAsCatechist' in person) {
    const courseDetails = (person as Catechist).coursesAsCatechist?.map((course: Course) =>
      `${course.catechismLevel?.name} - ${course.year} - ${course.location?.name}`
    ).filter(detail => detail.includes("undefined") === false).join(', ');
    label += courseDetails ? ` (${courseDetails})` : '';
  } else if (personType === 'Catechumen' && 'coursesAsCatechumen' in person) {
    const courseDetails = (person as Catechumen).coursesAsCatechumen?.map((course: Course) =>
      `${course.catechismLevel?.name} - ${course.year} - ${course.location?.name}`
    ).filter(detail => detail.includes("undefined") === false).join(', ');
    label += courseDetails ? ` (${courseDetails})` : '';
  }

  return label;
}
