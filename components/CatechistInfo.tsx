// components/CatechistInfo.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Catechist } from '@/types';
import { commonStyles } from '@/styles';
import { useSacraments } from '@/hooks/useSacraments';
import InfoItem from '@/components/InfoItem';

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
        <InfoItem label="Teléfono" value={catechist.phone || 'N/A'} />
        {(catechist.sacraments && catechist.sacraments.length > 0) && (
          <InfoItem
            label="Sacramentos"
            value={catechist?.sacraments?.map(s => getSacramentNameById(s.id)).join(', ') || 'N/A'}
          />
        )

        }
      </View>
    </Surface>
  );
};

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
});

export default CatechistInfo;
