import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function calculateAge(birthDate: Date): number {
  const baseDate = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - baseDate.getFullYear();
  const m = today.getMonth() - baseDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < baseDate.getDate())) {
    age--;
  }
  return age;
}

export function generateBirthDateFromAge(age: number): Date {
  const today = new Date();
  return new Date(today.getFullYear() - age, 0, 1);
}

export function parseDateString(dateString: string | number): Date | undefined {
  if (typeof dateString === 'number') {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }
  if (typeof dateString === 'string') {
    if (/^\d+$/.test(dateString)) {
      const date = new Date(parseInt(dateString));
      return isNaN(date.getTime()) ? undefined : date;
    }
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
}

export function formatDateToString(date: Date): string {
  return format(toZonedTime(new Date(date), 'America/Guayaquil'), 'yyyy-MM-dd');
}

export function formatHourToString(date: Date): string {
  return format(toZonedTime(new Date(date), 'America/Guayaquil'), 'HH:mm');
}

export function formatDateToTimestamp(date: Date): string {
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.getTime().toString();
}
