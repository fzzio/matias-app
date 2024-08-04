import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateAge } from '@/utils/calculate';
import { Catechumen } from '@/types';

interface CatechumenListProps {
  courseId: string;
}

const getRandomCatechist = (catechists: { name: string; lastName: string }[]) => {
  const randomIndex = Math.floor(Math.random() * catechists.length);
  const catechist = catechists[randomIndex];
  return `${catechist.name} ${catechist.lastName}`;
};

const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString();
};

const CatechumenList: React.FC<CatechumenListProps> = ({ courseId }) => {
  const [catechumens, setCatechumens] = useState<Catechumen[]>([]);
  const [catechumensTotal, setCatechumensTotal] = useState<Catechumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCatechumens = async () => {
      try {
        const catechumensData = await AsyncStorage.getItem('catechumens');
        const catechumensTotalData = await AsyncStorage.getItem('catechumensTotal');
        setCatechumens(catechumensData ? JSON.parse(catechumensData) : []);
        setCatechumensTotal(catechumensTotalData ? JSON.parse(catechumensTotalData) : []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load catechumens'));
      } finally {
        setLoading(false);
      }
    };

    loadCatechumens();
  }, []);

  if (loading) {
    return <DataTable.Row><DataTable.Cell>Loading...</DataTable.Cell></DataTable.Row>;
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
            <DataTable.Title style={styles.columnText}>Por</DataTable.Title>
            <DataTable.Title style={styles.columnText}>Fecha</DataTable.Title>
          </DataTable.Header>
          {filteredCatechumens.map((catechumen, idx) => {
            const isVisited = !catechumens.some(c => c.id === catechumen.id);
            return (
              <DataTable.Row key={idx}>
                <DataTable.Cell style={styles.columnNumber}>{idx + 1}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.lastName}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{catechumen.name}</DataTable.Cell>
                <DataTable.Cell style={styles.columnVisit}>{isVisited ? '✅' : '⏳'}</DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>
                  {/* {isVisited ? getRandomCatechist(catechumen.coursesAsCatechumen[0].catechists) : 'N/A'} */}
                  {'N/A'}
                </DataTable.Cell>
                <DataTable.Cell style={styles.columnText}>{isVisited ? getRandomDate() : 'N/A'}</DataTable.Cell>
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
    width: 800, // Adjust this width as necessary
  },
  columnNumber: {
    width: 10,
  },
  columnText: {
    width: 150,
  },
  columnVisit: {
    width: 80,
  },
});

export default CatechumenList;
