import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateSacramentMissingByLocation, calculateTotalMissingSacraments } from '@/services/sync/syncSurveys';
import { ReportLocation, SacramentReport } from '@/types';

const useSacramentMissingReport = () => {
  const [sacramentReportsByLocation, setSacramentReportsByLocation] = useState<ReportLocation[] | null>(null);
  const [totalMissingSacraments, setTotalMissingSacraments] = useState<SacramentReport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const storedMissingByLocation = await AsyncStorage.getItem('missingSacramentsByLocation');
        const storedTotalMissing = await AsyncStorage.getItem('totalMissingSacraments');

        if (storedMissingByLocation && storedTotalMissing) {
          const parsedMissingByLocation: ReportLocation[] = JSON.parse(storedMissingByLocation);
          const parsedTotalMissing: SacramentReport[] = JSON.parse(storedTotalMissing);

          setSacramentReportsByLocation(parsedMissingByLocation);
          setTotalMissingSacraments(parsedTotalMissing);
        } else {
          const calculatedMissingByLocation = await calculateSacramentMissingByLocation();
          const calculatedTotalMissing = await calculateTotalMissingSacraments();

          setSacramentReportsByLocation(calculatedMissingByLocation);
          setTotalMissingSacraments(calculatedTotalMissing);
        }
      } catch (err) {
        console.error('Error fetching sacrament reports:', err);
        setError('Error al obtener los reportes de sacramentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { sacramentReportsByLocation, totalMissingSacraments, loading, error };
};

export default useSacramentMissingReport;
