import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Catechist } from '@/types';
import { commonStyles } from '@/styles';
import { theme } from '@/styles/theme';
import { useSacraments } from '@/hooks/useSacraments';

interface CatechistInfoProps {
  catechist: Catechist;
  style?: ViewStyle;
}

const CatechistInfo: React.FC<CatechistInfoProps> = ({ catechist, style }) => {
  const { getSacramentNameById } = useSacraments();

  return (
    <Surface style={[styles.container, style]}>
      <Text style={styles.title}>{catechist.name} {catechist.lastName}</Text>
      <View style={styles.infoContainer}>
        <InfoItem label="Cédula" value={catechist.idCard || 'N/A'} />
        <InfoItem
          label="Fecha de Nacimiento"
          value={catechist.birthDate ? catechist.birthDate.toISOString().split('T')[0] : 'N/A'} 
        />
        <InfoItem
          label="Sacramentos"
          value={catechist?.sacraments?.map(s => getSacramentNameById(s.id)).join(', ') || 'N/A'}
        />
        <InfoItem label="Voluntario" value={catechist.isVolunteer ? 'Sí' : 'No'} />
      </View>
    </Surface>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...commonStyles.surface,
    marginBottom: 16,
  },
  title: {
    ...commonStyles.title,
    fontSize: 18,
    marginBottom: 12,
  },
  infoContainer: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  value: {
    ...commonStyles.bodyText,
  },
});

export default CatechistInfo;
