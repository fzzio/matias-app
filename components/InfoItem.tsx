import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { commonStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface InfoItemProps {
  label: string;
  value: string;
  style?: ViewStyle;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, style }) => (
  <View style={[style, styles.infoItem]}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flex: 1,
  },
  label: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 8,
  },
  value: {
    ...commonStyles.bodyText,
  },
});

export default InfoItem;
