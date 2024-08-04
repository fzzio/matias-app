import React from 'react';
import { DataTable } from 'react-native-paper';
import { calculateAge } from '@/utils/calculate';
import { Catechumen } from '@/types';

interface CatechumenListProps {
  catechumens: Catechumen[];
  courseId: string;
}

const CatechumenList: React.FC<CatechumenListProps> = ({ catechumens, courseId }) => {
  const filteredCatechumens = catechumens.filter(c =>
    c.coursesAsCatechumen.some((cc: { id: string }) => cc.id === courseId)
  );

  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Apellidos</DataTable.Title>
        <DataTable.Title>Nombres</DataTable.Title>
        <DataTable.Title>Fecha de Nacimiento</DataTable.Title>
        <DataTable.Title>Edad</DataTable.Title>
        <DataTable.Title>Teléfono</DataTable.Title>
      </DataTable.Header>
      {filteredCatechumens.map((catechumen, idx) => (
        <DataTable.Row key={idx}>
          <DataTable.Cell>{catechumen.lastName}</DataTable.Cell>
          <DataTable.Cell>{catechumen.name}</DataTable.Cell>
          <DataTable.Cell>
            {catechumen.birthDate
              ? new Date(catechumen.birthDate).toLocaleDateString()
              : 'N/A'}
          </DataTable.Cell>
          <DataTable.Cell>
            {catechumen.birthDate ? calculateAge(new Date(catechumen.birthDate)) : 'N/A'}
          </DataTable.Cell>
          <DataTable.Cell>{catechumen.phone || 'N/A'}</DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

export default CatechumenList;
