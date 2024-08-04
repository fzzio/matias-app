import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buttonStyles, commonStyles } from '@/styles';
import { useCatechismLevels } from '@/hooks/useCatechismLevels';
import { useCourses } from '@/hooks/useCourses';
import { SurveyStore } from '@/store/survey';
import CourseInfo from '@/components/CourseInfo';
import { Course } from '@/types';
import InfoItem from '@/components/InfoItem';

export default function CatechismLevelDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { catechismLevels, getCatechismLevelNameById } = useCatechismLevels();
  const { courses, loading, error } = useCourses();
  const { catechumens } = SurveyStore.useState();

  const levelName = getCatechismLevelNameById(id as string);
  const filteredCourses = courses.filter(course => course.catechismLevel.id === id);

  const coursesByLocation = filteredCourses.reduce<Record<string, Course[]>>((acc, course) => {
    if (!acc[course.location.name]) {
      acc[course.location.name] = [];
    }
    acc[course.location.name].push(course);
    return acc;
  }, {});

  if (loading) return <Text style={commonStyles.loadingText}>Cargando...</Text>;
  if (error) return <Text style={commonStyles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>{levelName}</Text>
        </View>
      </Surface>
      {Object.keys(coursesByLocation).map((location, index) => (
        <View key={index} style={styles.courseContainer}>
          <InfoItem label="Lugar" value={location} style={styles.locationTitle} />
          {coursesByLocation[location].map((course, idx) => (
            <CourseInfo key={idx} course={course} catechumens={catechumens} />
          ))}
        </View>
      ))}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={buttonStyles.secondaryButton}
          labelStyle={buttonStyles.secondaryButtonLabel}
        >
          Atrás
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  courseContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  locationTitle: {
    ...commonStyles.subtitle,
    marginBottom: 8,
    paddingHorizontal: 16
  },
  footer: {
    marginTop: 20,
  },
});
