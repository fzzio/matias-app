import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Searchbar, List, Chip, SearchbarProps, Icon } from 'react-native-paper';
import { Location } from '@/types';
import { searchInputStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface SearchLocationProps extends Omit<SearchbarProps, 'onChangeText' | 'value' | 'onSelectionChange'> {
  locations: Location[];
  onLocationSelect: (location: Location | null) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchLocation({
  locations,
  onLocationSelect,
  style,
  ...searchBarProps
}: SearchLocationProps) {
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
    <View style={[styles.container, style]}>
      <Searchbar
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={searchInputStyles.input}
        {...searchBarProps}
      />
      {searchQuery.trim() !== '' && (
        <List.Section style={searchInputStyles.listContainer}>
          {filteredLocations.map(location => (
            <List.Item
              key={location.id}
              title={location.name}
              onPress={() => handleSelect(location)}
              style={searchInputStyles.listItem}
            />
          ))}
        </List.Section>
      )}
      {selectedLocation && (
        <View style={searchInputStyles.chipsContainer}>
          <Chip
            onClose={handleRemove}
            style={searchInputStyles.chip}
            textStyle={searchInputStyles.chipText}
            closeIcon={props => <Icon source={"close"} {...props} color={theme.colors.onPrimary} />}
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
});
