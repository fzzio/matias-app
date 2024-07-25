import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSacraments } from '@/hooks/useSacraments';
import { PersonInput } from '@/types';

interface CatechumenInfoProps {
  catechumen: PersonInput;
  style?: ViewStyle;
}

const CatechumenInfo: React.FC<CatechumenInfoProps> = ({ catechumen, style }) => {
  const { getSacramentNameById } = useSacraments();

  return (
    <View  style={[styles.personContainer, style]}>
      <Text>Nombre: {catechumen.name} {catechumen.lastName}</Text>
      <Text>Cédula: {catechumen.idCard || 'N/A'}</Text>
      <Text>Fecha de Nacimiento: {catechumen.birthDate ? catechumen.birthDate.toISOString().split('T')[0] : 'N/A'}</Text>
      <Text>Sacramentos: {catechumen.sacraments.map(getSacramentNameById).join(', ') || 'N/A'}</Text>
      <Text>Voluntario: {catechumen.isVolunteer ? 'Sí' : 'No'}</Text>
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

export default CatechumenInfo;
