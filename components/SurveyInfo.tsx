import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Surface, } from 'react-native-paper';
import { Survey } from '@/types';
import { commonStyles } from '@/styles';
import { theme } from '@/styles/theme';

interface SurveyInfoProps {
  survey: Survey;
  style?: ViewStyle;
}

const SurveyInfo: React.FC<SurveyInfoProps> = ({ survey, style, }) => {
  return (
    <Surface style={[styles.container, style]}>
      <View style={styles.infoContainer}>
      <Text style={styles.title}>{JSON.stringify(survey)}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
  },
  title: {
    ...commonStyles.title,
    fontSize: 18,
    marginBottom: 12,
  },
  infoContainer: {
    marginTop: 10,
  },
  label: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 8,
  },
  coursesContainer: {

  },
  courseContainer: {
    marginTop: 5,
    paddingLeft: 10,
  },
  courseItem: {
    ...commonStyles.bodyText,
  },
  footer: {
    marginTop: 20
  }
});

export default SurveyInfo;
