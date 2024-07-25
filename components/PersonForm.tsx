import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TextInput, Checkbox, Text, Button, RadioButton } from 'react-native-paper';
import { calculateAge, generateBirthDateFromAge } from '@/utils/calculate';
import { PersonInput, Sacrament } from '@/types';
import { theme } from '@/styles/theme';

interface PersonFormProps {
  person: PersonInput;
  index: number;
  sacraments: Sacrament[];
  updatePerson: (index: number, field: string, value: any) => void;
  style?: ViewStyle;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, index, sacraments, updatePerson, style }) => {
  const [tempAge, setTempAge] = useState<string>('');
  const personInfo = `Persona #` + (index + 1);

  const handleAgeInput = (value: string) => {
    setTempAge(value);
  };

  const confirmAge = () => {
    const age = parseInt(tempAge);
    if (!isNaN(age)) {
      const birthDate = generateBirthDateFromAge(age);
      updatePerson(index, 'birthDate', birthDate);
    }
  };

  const toggleSacrament = (sacramentId: string) => {
    const updatedSacraments = person.sacraments.includes(sacramentId)
      ? person.sacraments.filter(id => id !== sacramentId)
      : [...person.sacraments, sacramentId];
    updatePerson(index, 'sacraments', updatedSacraments);
  };

  return (
    <View style={[styles.container, style]}>
      <Text variant="titleMedium">Datos de {personInfo}</Text>
      <TextInput
        label={`Cédula ${personInfo}`}
        value={person.idCard}
        onChangeText={(value) => updatePerson(index, 'idCard', value)}
        style={styles.input}
      />
      <TextInput
        label={`Nombre ${personInfo}`}
        value={person.name}
        onChangeText={(value) => updatePerson(index, 'name', value)}
        style={styles.input}
      />
      <TextInput
        label={`Apellido ${personInfo}`}
        value={person.lastName}
        onChangeText={(value) => updatePerson(index, 'lastName', value)}
        style={styles.input}
      />
      <TextInput
        label={`F. de Nacimiento ${personInfo} (YYYY-MM-DD)`}
        value={person.birthDate ? person.birthDate.toISOString().split('T')[0] : ''}
        onChangeText={(value) => updatePerson(index, 'birthDate', new Date(value))}
        style={styles.input}
      />
      <Text>Edad: {person.birthDate ? calculateAge(person.birthDate) : 'N/A'}</Text>
      <TextInput
        label={`Edad ${personInfo} (si no conoce)`}
        value={tempAge}
        onChangeText={handleAgeInput}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button onPress={confirmAge} mode='contained-tonal'>Confirmar Edad Persona {index + 1}</Button>

      <Text variant="bodyMedium">{`Sacramentos ${personInfo}:`}</Text>
      {sacraments.map((sacrament) => (
        <Checkbox.Item
          key={`${sacrament.id}_${index}`}
          label={sacrament.name}
          status={person.sacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleSacrament(sacrament.id)}
        />
      ))}

      <Text variant="bodyMedium">¿Desea participar como voluntario en actividades de la iglesia?</Text>
      <RadioButton.Group
        onValueChange={(value) => updatePerson(index, 'isVolunteer', value === 'yes')}
        value={person.isVolunteer ? 'yes' : 'no'}
      >
        <View style={styles.radioButton}>
          <RadioButton value="yes" />
          <Text>Sí</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="no" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.background,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  }
});