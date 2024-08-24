import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Catechumen } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, inputStyles, buttonStyles } from '@/styles';
import SacramentsSelector from '@/components/SacramentsSelector';
import { useSacraments } from '@/hooks/useSacraments';

interface CatechumenEditFormProps {
  visible: boolean;
  catechumen: Catechumen;
  onClose: (updatedCatechumen?: Catechumen) => void;
}

const CatechumenEditForm: React.FC<CatechumenEditFormProps> = ({ visible, catechumen, onClose }) => {
  const [editedCatechumen, setEditedCatechumen] = useState<Catechumen>(catechumen);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { sacraments } = useSacraments();

  const handleSave = async () => {
    try {
      const storedCatechumens = await AsyncStorage.getItem('catechumensToUpdate');
      const catechumensToUpdate: [Catechumen] = storedCatechumens ? JSON.parse(storedCatechumens) : [];
      const updatedCatechumens = catechumensToUpdate.filter((c: Catechumen) => c.id !== editedCatechumen.id);
      updatedCatechumens.push(editedCatechumen);
      await AsyncStorage.setItem('catechumensToUpdate', JSON.stringify(updatedCatechumens));
      onClose(editedCatechumen);
    } catch (error) {
      console.error('Error saving catechumen:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setEditedCatechumen({ ...editedCatechumen, birthDate: selectedDate });
    }
  };

  const handleSacramentsChange = (updatedSacramentIds: string[]) => {
    const updatedSacraments = sacraments.filter(sacrament =>
      updatedSacramentIds.includes(sacrament.id)
    );
    setEditedCatechumen({ ...editedCatechumen, sacraments: updatedSacraments });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <Surface style={styles.formContainer}>
          <Text style={commonStyles.title}>Editar Catecúmeno</Text>
          <TextInput
            label="Nombre"
            value={editedCatechumen.name}
            onChangeText={(text) => setEditedCatechumen({ ...editedCatechumen, name: text })}
            style={[inputStyles.defaultInput, styles.inputForm]}
          />
          <TextInput
            label="Apellido"
            value={editedCatechumen.lastName}
            onChangeText={(text) => setEditedCatechumen({ ...editedCatechumen, lastName: text })}
            style={[inputStyles.defaultInput, styles.inputForm]}
          />
          <TextInput
            label="Email"
            value={editedCatechumen.email || ''}
            onChangeText={(text) => setEditedCatechumen({ ...editedCatechumen, email: text })}
            style={[inputStyles.defaultInput, styles.inputForm]}
          />
          <TextInput
            label="Teléfono"
            value={editedCatechumen.phone || ''}
            onChangeText={(text) => setEditedCatechumen({ ...editedCatechumen, phone: text })}
            style={[inputStyles.defaultInput, styles.inputForm]}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.datePickerText}>
              Fecha de Nacimiento: {editedCatechumen.birthDate?.toISOString().split('T')[0] || ''}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={editedCatechumen.birthDate ? new Date(editedCatechumen.birthDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          <TextInput
            label="Dirección"
            value={editedCatechumen.address || ''}
            onChangeText={(text) => setEditedCatechumen({ ...editedCatechumen, address: text })}
            style={[inputStyles.defaultInput, styles.inputForm]}
          />
          <SacramentsSelector
            selectedSacraments={editedCatechumen.sacraments.map(s => s.id) || []}
            onSelect={handleSacramentsChange}
            label="Sacramentos:"
          />
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => onClose()}
              style={buttonStyles.secondaryButton}
              labelStyle={buttonStyles.secondaryButtonLabel}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={buttonStyles.primaryButton}
              labelStyle={buttonStyles.primaryButtonLabel}
            >
              Guardar
            </Button>
          </View>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  inputForm: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  datePicker: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
  },
});

export default CatechumenEditForm;
