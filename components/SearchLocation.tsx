import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, List, Chip } from 'react-native-paper';
import { Location } from '../types';

interface SearchLocationProps {
  locations: Location[];
  onLocationSelect: (location: Location | null) => void;
  placeholder?: string;
}

export function SearchLocation({ locations, onLocationSelect, placeholder = "Search location" }: SearchLocationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations([]);
    } else {
      const filtered = locations.filter(
        location => location.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery, locations]);

  const handleSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    setSearchQuery('');
  };

  const handleRemove = () => {
    setSelectedLocation(null);
    onLocationSelect(null);
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
        <List.Section>
          {filteredLocations.map(location => (
            <List.Item
              key={location.id}
              title={location.name}
              onPress={() => handleSelect(location)}
            />
          ))}
        </List.Section>
      )}
      {selectedLocation && (
        <View style={styles.chipContainer}>
          <Chip
            onClose={handleRemove}
            style={styles.chip}
          >
            {selectedLocation.name}
          </Chip>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  chip: {
    margin: 4,
  },
});