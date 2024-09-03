import { Catechumen, CatechumenInput, CatechumenUpdateInput } from '@/types/catechumen';
import { parseDateString } from './dateUtils';

export function jsonToCatechumen(json: any): Catechumen {
  return {
    ...json,
    birthDate: json.birthDate ? parseDateString(json.birthDate) : undefined,
    sacraments: json.sacraments || [],
    missingSacraments: json.missingSacraments || [],
    coursesAsCatechumen: json.coursesAsCatechumen || [],
  };
}

export function catechumenToInput(catechumen: Catechumen): CatechumenInput {
  return {
    name: catechumen.name,
    lastName: catechumen.lastName,
    idCard: catechumen.idCard,
    email: catechumen.email,
    phone: catechumen.phone,
    birthDate: catechumen.birthDate,
    sacraments: catechumen.sacraments.map(s => s.id),
    location: catechumen.location?.id,
    coursesAsCatechumen: catechumen.coursesAsCatechumen.map(c => c.id),
  };
}

export function catechumenToUpdateInput(catechumen: Catechumen): CatechumenUpdateInput {
  return {
    ...catechumenToInput(catechumen),
    id: catechumen.id,
  };
}
