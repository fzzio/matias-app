import { Person, PersonInput, PersonUpdateInput } from '@/types/person';
import { parseDateString } from './dateUtils';
import { Sacrament, Location } from '@/types';

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

export function inputToPerson(personInput: PersonInput, sacraments: Sacrament[], locations: Location[]): Person {
  return {
    id: '',
    ...personInput,
    sacraments: sacraments.filter(s => personInput.sacraments.includes(s.id)),
    missingSacraments: sacraments.filter(s => personInput.missingSacraments.includes(s.id)),
    location: locations.find(l => l.id === personInput.location)
  };
}

export function personToUpdateInput(person: Person): PersonUpdateInput {
  return {
    ...personToInput(person),
    id: person.id,
  };
}
