import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Keyboard } from 'react-native';
import { Searchbar, List, Chip, SearchbarProps, Icon } from 'react-native-paper';
import { Catechist, Catechumen, Course, Person } from '@/types';
import { searchInputStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface SearchPeopleProps extends Omit<SearchbarProps, 'onChangeText' | 'value' | 'onSelectionChange'> {
  people: Person[] | Catechist[] | Catechumen[];
  onSelectionChange: (selectedPeople: Person[] | Catechist[] | Catechumen[]) => void;
  personType?: 'Person' | 'Catechist' | 'Catechumen';
  style?: ViewStyle;
}

export function SearchPeople({
  people,
  onSelectionChange,
  personType,
  style,
  ...searchBarProps
}: SearchPeopleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[] | Catechist[] | Catechumen[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Person[] | Catechist[] | Catechumen[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPeople([]);
    } else {
      const filtered = people
        .filter(person =>
          !selectedPeople.some(selected => selected.id === person.id) &&
          (person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            person.lastName.toLowerCase().includes(searchQuery.toLowerCase())))
        .sort((a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`));
      setFilteredPeople(filtered);
    }
  }, [searchQuery, people, selectedPeople]);

  const handleSelect = (person: Person | Catechist | Catechumen) => {
    const newSelectedPeople = [...selectedPeople, person];
    newSelectedPeople.sort((a, b) => `${a.name} ${a.lastName}`.localeCompare(`${b.name} ${b.lastName}`));
    setSelectedPeople(newSelectedPeople);
    onSelectionChange(newSelectedPeople);
    setSearchQuery('');
    Keyboard.dismiss();
  };

  const handleRemove = (person: Person | Catechist | Catechumen) => {
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
            {getChipLabel(person, personType)}
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

function getChipLabel(person: Person | Catechist | Catechumen, personType?: 'Person' | 'Catechist' | 'Catechumen'): string {
  let label = `${person.name} ${person.lastName}`;

  if (personType === 'Catechist' && 'coursesAsCatechist' in person) {
    const courseDetails = person.coursesAsCatechist?.map((course: Course) =>
      `${course.catechismLevel?.name} - ${course.year} - ${course.location?.name}`
    ).filter(detail => detail.includes("undefined") === false).join(', ');
    label += courseDetails ? ` (${courseDetails})` : '';
  } else if (personType === 'Catechumen' && 'coursesAsCatechumen' in person) {
    const courseDetails = person.coursesAsCatechumen?.map((course: Course) =>
      `${course.catechismLevel?.name} - ${course.year} - ${course.location?.name}`
    ).filter(detail => detail.includes("undefined") === false).join(', ');
    label += courseDetails ? ` (${courseDetails})` : '';
  }

  return label;
}
