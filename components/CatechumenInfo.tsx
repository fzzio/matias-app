import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Catechumen, Course } from '@/types';
import { commonStyles } from '@/styles';
import { useSacraments } from '@/hooks/useSacraments';
import InfoItem from '@/components/InfoItem';
import { theme } from '@/styles/theme';
import CatechumenEditForm from './CatechumenEditForm';

interface CatechumenInfoProps {
  catechumen: Catechumen;
  style?: ViewStyle;
}

const CatechumenInfo: React.FC<CatechumenInfoProps> = ({ catechumen, style }) => {
  const { getSacramentNameById } = useSacraments();
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentCatechumen, setCurrentCatechumen] = useState<Catechumen>(catechumen);

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
    <TouchableOpacity onPress={() => setEditModalVisible(true)}>
      <Surface style={[styles.container, style]}>
        <Text style={styles.title}>{currentCatechumen.name} {currentCatechumen.lastName}</Text>
        <View style={styles.infoContainer}>
          <InfoItem label="Cédula" value={currentCatechumen.idCard || 'N/A'} />
          <InfoItem
            label="Fecha de Nacimiento"
            value={currentCatechumen.birthDate ? new Date(currentCatechumen.birthDate).toISOString().split('T')[0] : 'N/A'}
          />
          <InfoItem
            label="Email"
            value={currentCatechumen.email || 'N/A'}
          />
          <InfoItem
            label="Teléfono"
            value={currentCatechumen.phone || 'N/A'}
          />
          <View style={styles.coursesContainer}>
            <Text style={styles.label}>Cursos:</Text>
            {currentCatechumen.coursesAsCatechumen.length > 0
              ? currentCatechumen.coursesAsCatechumen.map(renderCourseInfo)
              : <Text>N/A</Text>
            }
          </View>
          <InfoItem
            label="Sacramentos"
            value={currentCatechumen.sacraments.map(s => getSacramentNameById(s.id)).join(', ') || 'N/A'}
          />
        </View>
      </Surface>
      <CatechumenEditForm
        visible={isEditModalVisible}
        catechumen={currentCatechumen}
        onClose={(updatedCatechumen) => {
          setEditModalVisible(false);
          if (updatedCatechumen) {
            setCurrentCatechumen(updatedCatechumen);
          }
        }}
      />
    </TouchableOpacity>
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
});

export default CatechumenInfo;
