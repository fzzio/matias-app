import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Catechumen, Course } from '@/types';
import { commonStyles } from '@/styles';
import { useSacraments } from '@/hooks/useSacraments';
import InfoItem from '@/components/InfoItem';
import { theme } from '@/styles/theme';

interface CatechumenInfoProps {
  catechumen: Catechumen;
  style?: ViewStyle;
}

const CatechumenInfo: React.FC<CatechumenInfoProps> = ({ catechumen, style }) => {
  const { getSacramentNameById } = useSacraments();

  const renderCourseInfo = (course: Course) => (
    <View key={course.id} style={styles.courseContainer}>
      <Text style={styles.courseItem}>• Ubicación: {course.location?.name || 'N/A'}</Text>
      <Text style={styles.courseItem}>• Año: {course.year || 'N/A'}</Text>
      <Text style={styles.courseItem}>• Nivel: {course.catechismLevel?.name || 'N/A'}</Text>
      <Text style={styles.courseItem}>• Paralelo: {course.room || 'N/A'}</Text>
      <Text style={styles.courseItem}>• Descripción: {course.description || 'N/A'}</Text>
    </View>
  );

  return (
    <Surface style={[styles.container, style]}>
      <Text style={styles.title}>{catechumen.name} {catechumen.lastName}</Text>
      <View style={styles.infoContainer}>
        <InfoItem label="Cédula" value={catechumen.idCard || 'N/A'} />
        <InfoItem
          label="Fecha de Nacimiento"
          value={catechumen.birthDate ? new Date(catechumen.birthDate).toISOString().split('T')[0] : 'N/A'}
        />
        <InfoItem
          label="Email"
          value={catechumen.email || 'N/A'}
        />
        <InfoItem
          label="Teléfono"
          value={catechumen.phone || 'N/A'}
        />
        <View style={styles.coursesContainer}>
          <Text style={styles.label}>Cursos:</Text>
          {catechumen.coursesAsCatechumen.length > 0
            ? catechumen.coursesAsCatechumen.map(renderCourseInfo)
            : <Text>N/A</Text>
          }
        </View>
        <InfoItem
          label="Sacramentos"
          value={catechumen.sacraments.map(s => getSacramentNameById(s.id)).join(', ') || 'N/A'}
        />
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
  coursesContainer: {
    marginTop: 8,
  },
  label: {
    ...commonStyles.bodyText,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: 8,
  },
  courseContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  courseItem: {
    ...commonStyles.bodyText,
  },
});

export default CatechumenInfo;
