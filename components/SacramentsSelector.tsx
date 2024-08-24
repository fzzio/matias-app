import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import { useSacraments } from '@/hooks/useSacraments';
import { commonStyles } from '@/styles';

interface SacramentsSelectorProps {
  selectedSacraments: string[];
  onSelect: (updatedSacraments: string[]) => void;
  label: string;
}

const SacramentsSelector: React.FC<SacramentsSelectorProps> = ({
  selectedSacraments,
  onSelect,
  label,
}) => {
  const { sacraments, loading } = useSacraments();

  const handleToggleSacrament = (sacramentId: string) => {
    const updatedSacraments = selectedSacraments.includes(sacramentId)
      ? selectedSacraments.filter(id => id !== sacramentId)
      : [...selectedSacraments, sacramentId];
    onSelect(updatedSacraments);
  };

  if (loading) {
    return <Text>Cargando sacramentos...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={commonStyles.subtitle}>{label}</Text>
      {sacraments.map((sacrament) => (
        <Checkbox.Item
          key={sacrament.id}
          label={sacrament.name}
          status={selectedSacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
          onPress={() => handleToggleSacrament(sacrament.id)}
          style={styles.checkboxItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  checkboxItem: {
    marginVertical: 5,
  },
});

export default SacramentsSelector;
