import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Catechumen } from '@/types';

interface CatechumenListProps {
  courseId: string;
  style?: ViewStyle;
}

const CatechumenList: React.FC<CatechumenListProps> = ({ courseId, style }) => {
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

  const filteredCatechumens = catechumensTotal.filter(c =>
    c.coursesAsCatechumen.some((cc: { id: string }) => cc.id === courseId)
  );

  return (
    <ScrollView horizontal>
      <ScrollView>
        <DataTable style={styles.dataTable}>
          <DataTable.Header>
            <DataTable.Title style={styles.columnNumber}>Numero</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Apellidos</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Nombres</DataTable.Title>
            <DataTable.Title style={styles.columnVisit}>Visitado</DataTable.Title>
            <DataTable.Title style={styles.columnCatechist}>Por</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Fecha</DataTable.Title>
          </DataTable.Header>
          {filteredCatechumens.map((catechumen, idx) => {
            const survey = conductedSurveys.find(s =>
              s.catechumens.some((c: { id: string }) => c.id === catechumen.id)
            );
            const isVisited = !!survey;
            const catechists = isVisited ? survey.catechists.map((c: { name: string, lastName: string }) => `${c.name} ${c.lastName}`).join(', ') : '-';
            const visitDate = isVisited ? new Date(parseInt(survey.createdAt, 10)).toISOString().split('T')[0] : '-';

            return (
              <DataTable.Row key={idx}>
                <DataTable.Cell style={styles.columnNumber}>{idx + 1}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.lastName}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.name}</DataTable.Cell>
                <DataTable.Cell style={styles.columnVisit}>{isVisited ? '✅' : '-'}</DataTable.Cell>
                <DataTable.Cell style={styles.columnCatechist}>{catechists}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{visitDate}</DataTable.Cell>
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
  columnNumber: {
    width: 60,
  },
  columnText: {
    width: 150,
  },
  columnCatechist: {
    width: 250,
  },
  columnVisit: {
    width: 60,
  },
});

export default CatechumenList;
