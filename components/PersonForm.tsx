import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Checkbox, Text, Button } from 'react-native-paper';
import { calculateAge, generateBirthDateFromAge } from '@/utils/calculate';
import { PersonInput, Sacrament } from '@/types';

interface PersonFormProps {
  person: PersonInput;
  index: number;
  sacraments: Sacrament[];
  updatePerson: (index: number, field: string, value: any) => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, index, sacraments, updatePerson }) => {
  const [tempAge, setTempAge] = useState<string>('');

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
    <View style={styles.container}>
      <TextInput
        label={"Cédula Persona #" + (index)}
        value={person.idCard}
        onChangeText={(value) => updatePerson(index, 'idCard', value)}
        style={styles.input}
      />
      <TextInput
        label={"Nombre Persona #" + index}
        value={person.name}
        onChangeText={(value) => updatePerson(index, 'name', value)}
        style={styles.input}
      />
      <TextInput
        label={"Apellido Persona #" + index}
        value={person.lastName}
        onChangeText={(value) => updatePerson(index, 'lastName', value)}
        style={styles.input}
      />
      <TextInput
        label={"F. de Nacimiento  Persona #" + index + " (YYYY-MM-DD)"}
        value={person.birthDate ? person.birthDate.toISOString().split('T')[0] : ''}
        onChangeText={(value) => updatePerson(index, 'birthDate', new Date(value))}
        style={styles.input}
      />
      <Text>Edad: {person.birthDate ? calculateAge(person.birthDate) : 'N/A'}</Text>
      <TextInput
        label={"Edad  Persona #" + index + " (si no conoce)"}
        value={tempAge}
        onChangeText={handleAgeInput}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button onPress={confirmAge}>Confirmar Edad</Button>

      <Text style={styles.sectionTitle}>Sacramentos:</Text>
      {sacraments.map((sacrament) => (
        <Checkbox.Item
          key={sacrament.id}
          label={sacrament.name}
          status={person.sacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleSacrament(sacrament.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: "100%"
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#FFFFFF"
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});
