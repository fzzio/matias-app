export function sanitizeSheetName(name: string): string {
  // Reemplazar caracteres no permitidos con guiones
  let sanitized = name.replace(/[:\/\\?*[\]]/g, '-');

  // Eliminar cualquier caracter que no sea alfanumérico, espacio, guion o guion bajo
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s-_]/g, '');

  // Truncar el nombre si es más largo de 31 caracteres (límite de Excel)
  sanitized = sanitized.slice(0, 31);

  // Asegurarse de que el nombre no esté vacío
  if (sanitized.trim().length === 0) {
    sanitized = 'Hoja';
  }

  return sanitized.trim();
}