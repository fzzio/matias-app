import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { commonStyles } from '@/styles';
import InfoItem from '@/components/InfoItem';
import { Course } from '@/types';
import CatechumenList from '@/components/CatechumenList';

interface CourseInfoProps {
  course: Course;
  catechumens: any[];
}

const CourseInfo: React.FC<CourseInfoProps> = ({ course, catechumens }) => {
  return (
    <Surface style={[commonStyles.surface, styles.courseContainer]}>
      <View style={styles.courseContainer}>
        <InfoItem label="Catequistas" value={course.catechists.map(c => `${c.name} ${c.lastName}`).join(', ')} />
        <InfoItem label="Año" value={course.year} />
        <InfoItem label="Descripción" value={course.description} />
        <InfoItem label="Catecúmenos" value="" />
        <CatechumenList catechumens={catechumens} courseId={course.id} />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  courseHeader: {
    marginBottom: 20,
  },
  courseContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginBottom: 8,
  },
});

export default CourseInfo;
