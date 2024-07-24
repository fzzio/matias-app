import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSacraments } from '@/hooks/useSacraments';
import { PersonInput } from '@/types';

interface PersonInfoProps {
  person: PersonInput
  style?: ViewStyle;
}

const PersonInfo: React.FC<PersonInfoProps> = ({ person, style }) => {
  const { getSacramentNameById } = useSacraments();

  return (
    <View  style={[styles.personContainer, style]}>
      <Text>Nombre: {person.name} {person.lastName}</Text>
      <Text>Cédula: {person.idCard || 'N/A'}</Text>
      <Text>Fecha de Nacimiento: {person.birthDate ? person.birthDate.toISOString().split('T')[0] : 'N/A'}</Text>
      <Text>Sacramentos: {person.sacraments.map(getSacramentNameById).join(', ') || 'N/A'}</Text>
      <Text>Voluntario: {person.isVolunteer ? 'Sí' : 'No'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  personContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default PersonInfo;
