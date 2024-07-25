import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSacraments } from '@/hooks/useSacraments';
import { Catechumen } from '@/types';

interface CatechumenInfoProps {
  catechumen: Catechumen;
  style?: ViewStyle;
}

const CatechumenInfo: React.FC<CatechumenInfoProps> = ({ catechumen, style }) => {
  const { getSacramentNameById } = useSacraments();

  return (
    <View  style={[styles.personContainer, style]}>
      <Text>Nombre: {catechumen.name} {catechumen.lastName}</Text>
      <Text>Cédula: {catechumen.idCard || 'N/A'}</Text>
      <Text>Fecha de Nacimiento: {catechumen.birthDate ? catechumen.birthDate.toISOString().split('T')[0] : 'N/A'}</Text>
      <Text>Sacramentos: {catechumen.sacraments.map(s => getSacramentNameById(s.id)).join(', ') || 'N/A'}</Text>

      <Text>Voluntario: {catechumen.isVolunteer ? 'Sí' : 'No'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  personContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});

export default CatechumenInfo;
