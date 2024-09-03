import { Person, PersonInput, PersonUpdateInput } from '@/types/person';
import { parseDateString } from './dateUtils';

export function jsonToPerson(json: any): Person {
  return {
    ...json,
    birthDate: json.birthDate ? parseDateString(json.birthDate) : undefined,
    sacraments: json.sacraments || [],
    missingSacraments: json.missingSacraments || [],
  };
}

export function personToInput(person: Person): PersonInput {
  return {
    name: person.name,
    lastName: person.lastName,
    idCard: person.idCard,
    email: person.email,
    phone: person.phone,
    birthDate: person.birthDate,
    sacraments: person.sacraments.map(s => s.id),
    missingSacraments: person.missingSacraments.map(s => s.id),
    isVolunteer: person.isVolunteer,
    location: person.location?.id
  };
}

export function personToUpdateInput(person: Person): PersonUpdateInput {
  return {
    ...personToInput(person),
    id: person.id,
  };
}
