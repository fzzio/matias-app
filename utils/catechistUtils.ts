import { Catechist, CatechistInput, CatechistUpdateInput } from '@/types/catechist';
import { parseDateString } from './dateUtils';

export function jsonToCatechist(json: any): Catechist {
  return {
    ...json,
    birthDate: json.birthDate ? parseDateString(json.birthDate) : undefined,
    sacraments: json.sacraments || [],
    coursesAsCatechist: json.coursesAsCatechist || [],
  };
}

export function catechistToInput(catechist: Catechist): CatechistInput {
  return {
    name: catechist.name,
    lastName: catechist.lastName,
    idCard: catechist.idCard,
    email: catechist.email,
    phone: catechist.phone,
    birthDate: catechist.birthDate,
    sacraments: catechist.sacraments.map(s => s.id),
    location: catechist.location?.id,
    coursesAsCatechist: catechist.coursesAsCatechist.map(c => c.id),
  };
}

export function catechistToUpdateInput(catechist: Catechist): CatechistUpdateInput {
  return {
    ...catechistToInput(catechist),
    id: catechist.id,
  };
}
