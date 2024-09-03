import { Person, PersonInput, PersonUpdateInput } from './person';
import { Course } from './course';
import { Location } from './common';

export interface Catechumen extends Omit<Person, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechumen: Course[];
  location?: Location;
  address?: string;
}

export interface CatechumenInput extends Omit<PersonInput, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechumen: string[];
  location?: string;
  address?: string;
}

export interface CatechumenUpdateInput extends Omit<PersonUpdateInput, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechumen: string[];
  location?: string;
  address?: string;
}
