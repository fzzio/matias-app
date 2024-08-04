import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TextInput, Checkbox, Text, Button, RadioButton, Surface } from 'react-native-paper';
import { calculateAge, generateBirthDateFromAge } from '@/utils/calculate';
import { PersonInput, Sacrament } from '@/types';
import { theme } from '@/styles/theme';
import { buttonStyles, commonStyles, inputStyles } from '@/styles';

interface PersonFormProps {
  person: PersonInput;
  index: number;
  sacraments: Sacrament[];
  updatePerson: (index: number, field: string, value: any) => void;
  style?: ViewStyle;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, index, sacraments, updatePerson, style }) => {
  const [tempAge, setTempAge] = useState<string>('');
  const personInfo = `Persona #${index + 1}`;

  const handleAgeInput = (value: string) => {
    setTempAge(value);
  };

  const confirmAge = () => {
    const age = parseInt(tempAge);
    if (!isNaN(age)) {
      const birthDate = generateBirthDateFromAge(age);
      updatePerson(index, 'birthDate', birthDate);
      setTempAge('');
    }
  };

  const toggleSacrament = (sacramentId: string) => {
    const updatedSacraments = person.sacraments.includes(sacramentId)
      ? person.sacraments.filter(id => id !== sacramentId)
      : [...person.sacraments, sacramentId];
    updatePerson(index, 'sacraments', updatedSacraments);
  };

  const toggleMissingSacrament = (sacramentId: string) => {
    const updatedMissingSacraments = person.missingSacraments.includes(sacramentId)
      ? person.missingSacraments.filter(id => id !== sacramentId)
      : [...person.missingSacraments, sacramentId];
    updatePerson(index, 'missingSacraments', updatedMissingSacraments);
  };

  return (
    <Surface style={[styles.container, style]}>
      <Text style={styles.title}>{personInfo}</Text>
      <TextInput
        label="Cédula"
        value={person.idCard}
        onChangeText={(value) => updatePerson(index, 'idCard', value)}
        style={styles.input}
      />
      <TextInput
        label="Nombre"
        value={person.name}
        onChangeText={(value) => updatePerson(index, 'name', value)}
        style={styles.input}
      />
      <TextInput
        label="Apellido"
        value={person.lastName}
        onChangeText={(value) => updatePerson(index, 'lastName', value)}
        style={styles.input}
      />
      <TextInput
        label="Fecha de Nacimiento (YYYY-MM-DD)"
        value={person.birthDate ? person.birthDate.toISOString().split('T')[0] : ''}
        onChangeText={(value) => updatePerson(index, 'birthDate', new Date(value))}
        style={styles.input}
      />
      <Text style={styles.ageText}>Edad: {person.birthDate ? calculateAge(person.birthDate) : 'N/A'}</Text>
      <View style={styles.ageInputContainer}>
        <TextInput
          label="Edad"
          value={tempAge}
          onChangeText={handleAgeInput}
          keyboardType="numeric"
          style={[styles.input, styles.ageInput]}
        />
        <Button
          onPress={confirmAge}
          mode="contained-tonal"
          style={[buttonStyles.secondaryButton, styles.confirmAgeButton ]}
          labelStyle={[buttonStyles.secondaryButtonLabel, styles.secondaryButtonLabel]}
        >
          Confirmar
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Sacramentos:</Text>
      {sacraments.map((sacrament) => (
        <Checkbox.Item
          key={`${sacrament.id}_${index}`}
          label={sacrament.name}
          status={person.sacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleSacrament(sacrament.id)}
        />
      ))}
      <Text style={styles.sectionTitle}>Sacramentos pendientes:</Text>
      {sacraments.map((sacrament) => (
        <Checkbox.Item
          key={`p_${sacrament.id}_${index}`}
          label={sacrament.name}
          status={person.missingSacraments.includes(sacrament.id) ? 'checked' : 'unchecked'}
          onPress={() => toggleMissingSacrament(sacrament.id)}
        />
      ))}

      <Text style={styles.sectionTitle}>¿Desea participar como voluntario en actividades de la iglesia?</Text>
      <RadioButton.Group
        onValueChange={(value) => updatePerson(index, 'isVolunteer', value === 'yes')}
        value={person.isVolunteer ? 'yes' : 'no'}
      >
        <View style={styles.radioButtonContainer}>
          <RadioButton.Item label="Sí" value="yes" />
          <RadioButton.Item label="No" value="no" />
        </View>
      </RadioButton.Group>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    ...commonStyles.surface,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.backdrop
  },
  title: {
    ...commonStyles.title,
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    ...inputStyles.defaultInput,
    marginBottom: 16,
  },
  ageText: {
    ...commonStyles.bodyText,
    marginBottom: 8,
  },
  ageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ageInput: {
    flex: 1,
    marginRight: 8,
  },
  confirmAgeButton: {
    marginLeft: 8,
    marginBottom: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 100,
    verticalAlign: 'middle'
  },
  secondaryButtonLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    ...commonStyles.subtitle,
    marginTop: 16,
    marginBottom: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
