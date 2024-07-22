export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function generateBirthDateFromAge(age: number): Date {
  const today = new Date();
  return new Date(today.getFullYear() - age, 0, 1);
}