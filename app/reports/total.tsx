import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { commonStyles, buttonStyles } from '@/styles';
import { calculateAge, formatDateToString, formatDateToTimestamp } from '@/utils/dateUtils';
import { useCatechismLevels } from '@/hooks/useCatechismLevels';
import { useSurveys } from '@/hooks/useSurveys';
import { Catechumen, Person, Survey } from '@/types';
import { sanitizeSheetName } from '@/utils/excelUtils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '@/styles/theme';
import { useSacraments } from '@/hooks/useSacraments';

export default function TotalReports() {
  const router = useRouter();
  const { surveys } = useSurveys();
  const { sacraments } = useSacraments();
  const { catechismLevels } = useCatechismLevels();
  const [isLoading, setIsLoading] = useState(false);

  const downloadAllBySurvey = async () => {
    setIsLoading(true);
    try {
      const workbook = XLSX.utils.book_new();

      // Crear un mapa de niveles de catecismo a encuestas
      const surveysByLevel = new Map<string, Survey[]>();
      catechismLevels.forEach(level => surveysByLevel.set(sanitizeSheetName(level.name), []));

      surveys.forEach(survey => {
        survey.catechumens.forEach(catechumen => {
          const level = sanitizeSheetName(catechumen.coursesAsCatechumen[0]?.catechismLevel.name);
          if (level) {
            const surveysForLevel = surveysByLevel.get(level) || [];
            if (!surveysForLevel.includes(survey)) {
              surveysForLevel.push(survey);
              surveysByLevel.set(level, surveysForLevel);
            }
          }
        });
      });

      // Función para formatear personas
      const formatPerson = (person: Person) => {
        const birthDate = person.birthDate ? new Date(person.birthDate) : null;
        const age = birthDate ? calculateAge(birthDate) : 'N/A';
        return `${person.lastName} ${person.name} - ${birthDate ? formatDateToString(birthDate) : 'N/A'} (${age}) - ${person.idCard || 'N/A'}`;
      };

      // Función para formatear catequizandos
      const formatCatechumen = (catechumen: Catechumen) => {
        const level = catechumen.coursesAsCatechumen[0]?.catechismLevel.name || 'N/A';
        return `${catechumen.lastName} ${catechumen.name} - ${level}`;
      };

      // Crear una hoja para cada nivel de catecismo
      surveysByLevel.forEach((surveysForLevel, levelName) => {
        const worksheet = XLSX.utils.json_to_sheet(
          surveysForLevel.map(survey => ({
            'Ubicación': survey.location.name,
            'Tamaño del Hogar': survey.householdSize,
            'Personas': survey.people.map(formatPerson).join('; '),
            'Catequizandos': survey.catechumens.map(formatCatechumen).join('; '),
            'Observaciones': survey.observations || '',
            'Catequistas visitantes': survey.catechists.map(c => `${c.lastName} ${c.name}`).join('; '),
            'Fecha': formatDateToString(survey.createdAt)
          }))
        );

        XLSX.utils.book_append_sheet(workbook, worksheet, levelName);
      });

      // Generar nombre de archivo con fecha y hora
      const fileName = `encuestas-totales-${formatDateToTimestamp(new Date())}.xlsx`;

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Compartir archivo de encuestas' });
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error);
      Alert.alert('Error', 'Error al generar el archivo Excel para encuestas totales');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExcelByLocations = async () => {
    setIsLoading(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Crear un mapa de locaciones
      const surveysByLocation = new Map<string, Survey[]>();
      surveys.forEach(survey => {
        const location = survey.location.name;
        const surveysForLocation = surveysByLocation.get(location) || [];
        surveysForLocation.push(survey);
        surveysByLocation.set(location, surveysForLocation);
      });


      // Crear una hoja por cada ubicación
      surveysByLocation.forEach((surveysForLocation, locationName) => {
        const safeSheetName = sanitizeSheetName(locationName);
        const worksheet = XLSX.utils.json_to_sheet(
          surveysForLocation.flatMap(survey =>
            survey.people.map(person => {
              return {
                'Cedula': person.idCard || 'N/A',
                'Apellidos': person.lastName,
                'Nombres': person.name,
                'Fecha de Nacimiento': person.birthDate ? formatDateToString(new Date(person.birthDate)) : 'N/A',
                'Edad': person.birthDate ? calculateAge(new Date(person.birthDate)) : 'N/A',
                'Voluntario': person.isVolunteer ? 'Si' : 'No',
                ...Object.fromEntries(
                  sacraments.map((sacrament) => [
                    sacrament.name,
                    person.sacraments.some(personSacrament => personSacrament.id === sacrament.id) ? 'Si' : 'No'
                  ])
                ),
                ...Object.fromEntries(
                  sacraments.map((sacrament) => [
                    `Falta ${sacrament.name}`,
                    person.missingSacraments.some(personMissingSacrament => personMissingSacrament.id === sacrament.id) ? 'Si' : 'No'
                  ])
                ),
                'Teléfonos contacto': [
                  person.phone,
                  ...survey.catechumens
                    .map(c => c.phone)
                  ].filter(Boolean).join(' - ') || 'N/A',
                'Observaciones en la entrevista': survey.observations || 'N/A',
                'Catequizando(s)': survey.catechumens
                  .map(c => `${c.lastName} ${c.name} - ${c.coursesAsCatechumen[0]?.catechismLevel.name} - ${c.coursesAsCatechumen[0]?.location.name}`)
                  .join('; '),
              }
            })
          )
        );
        XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName);
      });


      // Generar nombre de archivo con fecha y hora
      const fileName = `encuestas-por_persona-${formatDateToTimestamp(new Date())}.xlsx`;

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const uri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Compartir archivo de encuestas' });
    } catch (error) {
      console.error('Error al generar el archivo Excel:', error);
      Alert.alert('Error', 'Error al generar el archivo Excel para encuestas por persona');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Surface style={commonStyles.surface}>
        <View style={commonStyles.headerTitle}>
          <Text style={commonStyles.title}>Reportes Totales</Text>
        </View>
        <View style={styles.body}>
          <Button
            icon={() => <Ionicons name="cloud-download" size={24} color={theme.colors.onPrimary} />}
            mode="outlined"
            onPress={downloadExcelByLocations}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
            disabled={isLoading}
          >
            {isLoading ? 'Descargando...' : 'Por persona'}
          </Button>
          <Button
            icon={() => <Ionicons name="cloud-download" size={24} color={theme.colors.onPrimary} />}
            mode="outlined"
            onPress={downloadAllBySurvey}
            style={buttonStyles.primaryButton}
            labelStyle={buttonStyles.primaryButtonLabel}
            disabled={isLoading}
          >
            {isLoading ? 'Descargando...' : 'Por Encuesta'}
          </Button>
          {isLoading && <ActivityIndicator animating={true} />}
        </View>
        <View style={styles.footer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={buttonStyles.secondaryButton}
            labelStyle={buttonStyles.secondaryButtonLabel}
          >
            Atrás
          </Button>
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 8,
  },
  body: {
    gap: 16,
    marginBottom: 5,
    alignItems: 'center',
  },
  footer: {
    gap: 16,
  },
});
