import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useSacraments } from '@/hooks/useSacraments';
import { Catechist, PersonInput } from '@/types';

interface CatechistInfoProps {
  catechist: Catechist;
  style?: ViewStyle;
}

const CatechistInfo: React.FC<CatechistInfoProps> = ({ catechist, style }) => {
  const { getSacramentNameById } = useSacraments();

  return (
    <View  style={[styles.personContainer, style]}>
      <Text>Nombre: {catechist.name} {catechist.lastName}</Text>
      <Text>Cédula: {catechist.idCard || 'N/A'}</Text>
      <Text>Fecha de Nacimiento: {catechist.birthDate ? catechist.birthDate.toISOString().split('T')[0] : 'N/A'}</Text>
      {/* <Text>Sacramentos: {catechist.sacraments.map(getSacramentNameById).join(', ') || 'N/A'}</Text> */}
      <Text>Voluntario: {catechist.isVolunteer ? 'Sí' : 'No'}</Text>
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

export default CatechistInfo;
