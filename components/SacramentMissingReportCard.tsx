import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import InfoItem from '@/components/InfoItem';
import { theme } from '@/styles/theme';
import { SacramentReport } from '@/types';
import { commonStyles } from '@/styles';

interface SacramentMissingReportCardProps {
  label: string;
  sacramentReportData: SacramentReport[]
}

const SacramentMissingReportCard: React.FC<SacramentMissingReportCardProps> = ({ label, sacramentReportData }) => {
  return (
    <Surface style={styles.card}>
      <Text style={styles.cardTitle}>{label}</Text>
      <View>
        {sacramentReportData.map((item) => (
          <InfoItem key={item.sacrament.id} label={item.sacrament.name} value={item.missingCount.toString()} />
        ))}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    ...commonStyles.subtitle,
    color: theme.colors.onSurface,
  },
});

export default SacramentMissingReportCard;
