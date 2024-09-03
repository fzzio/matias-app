import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { Button, DataTable, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Catechumen } from '@/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { buttonStyles } from '@/styles';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { formatDateToString, formatHourToString } from '@/utils/dateUtils';

interface CatechumenListProps {
  courseId: string;
  style?: ViewStyle;
}

const CatechumenList: React.FC<CatechumenListProps> = ({ courseId, style }) => {
  const router = useRouter();
  const [catechumens, setCatechumens] = useState<Catechumen[]>([]);
  const [catechumensTotal, setCatechumensTotal] = useState<Catechumen[]>([]);
  const [conductedSurveys, setConductedSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCatechumens = async () => {
      try {
        const catechumensData = await AsyncStorage.getItem('catechumens');
        const catechumensTotalData = await AsyncStorage.getItem('catechumensTotal');
        const surveysData = await AsyncStorage.getItem('conductedSurveys');

        setCatechumens(catechumensData ? JSON.parse(catechumensData) : []);
        setCatechumensTotal(catechumensTotalData ? JSON.parse(catechumensTotalData) : []);
        setConductedSurveys(surveysData ? JSON.parse(surveysData) : []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechumens'));
      } finally {
        setLoading(false);
      }
    };

    loadCatechumens();
  }, []);

  if (loading) {
    return <DataTable.Row><DataTable.Cell>Cargando...</DataTable.Cell></DataTable.Row>;
  }

  if (error) {
    return <DataTable.Row><DataTable.Cell>Error: {error.message}</DataTable.Cell></DataTable.Row>;
  }

  if (!catechumens || !catechumensTotal) {
    return <DataTable.Row><DataTable.Cell>No data available</DataTable.Cell></DataTable.Row>;
  }

  const filteredCatechumens = catechumensTotal
    .filter(c => c.coursesAsCatechumen.some((cc: { id: string }) => cc.id === courseId))
    .sort((a, b) => a.lastName.localeCompare(b.lastName));

  return (
    <ScrollView horizontal style={[style]}>
      <ScrollView>
        <DataTable style={styles.dataTable}>
          <DataTable.Header>
            <DataTable.Title style={styles.columnIndex}>No.</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Apellidos</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Nombres</DataTable.Title>
            <DataTable.Title style={styles.columnVisit}>Visitado</DataTable.Title>
            <DataTable.Title style={styles.columnDate}>Fecha</DataTable.Title>
            <DataTable.Title style={styles.columnNumber}>Hora</DataTable.Title>
            <DataTable.Title style={styles.columnCatechist}>Por</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Acciones</DataTable.Title>
          </DataTable.Header>
          {filteredCatechumens.map((catechumen, idx) => {
            const survey = conductedSurveys.find(s =>
              s.catechumens.some((c: { id: string }) => c.id === catechumen.id)
            );
            const isVisited = !!survey;
            const catechists = isVisited ? survey.catechists.map((c: { name: string, lastName: string }) => `${c.name} ${c.lastName}`).join(', ') : '-';
            const visitDate = isVisited ? formatDateToString(survey.createdAt) : '-';
            const visitTime = isVisited ? formatHourToString(survey.createdAt) : '-';

            return (
              <DataTable.Row key={idx}>
                <DataTable.Cell style={styles.columnIndex}>{idx + 1}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.lastName}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.name}</DataTable.Cell>
                <DataTable.Cell style={styles.columnVisit}>{isVisited ? '✅' : '-'}</DataTable.Cell>
                <DataTable.Cell style={styles.columnDate}>{visitDate}</DataTable.Cell>
                <DataTable.Cell style={styles.columnNumber}>{visitTime}</DataTable.Cell>
                <DataTable.Cell style={styles.columnCatechist}>
                  <Text style={styles.columnCatechistWrap}>{catechists}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>
                  {isVisited && (
                    <Button
                      icon={() => <Ionicons name="eye" size={24} color={theme.colors.onBackground} />}
                      mode="contained"
                      onPress={() => router.push(`/reports/surveyDetails/${survey.id}`)}
                      style={[buttonStyles.secondaryButton, styles.viewButton]}
                      labelStyle={buttonStyles.secondaryButtonLabel}
                    >
                      Ver
                    </Button>
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dataTable: {
    width: 'auto',
  },
  columnIndex: {
    width: 30,
  },
  columnNumber: {
    width: 60,
  },
  columnText: {
    width: 150,
  },
  columnDate: {
    width: 100,
  },
  columnCatechist: {
    width: 200,
  },
  columnCatechistWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  columnVisit: {
    width: 60,
  },
  viewButton: {
    margin: 5,
    paddingVertical: 2,
    paddingHorizontal: 2,
    minWidth: 100,
  }
});

export default CatechumenList;
