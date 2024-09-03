import { Person, PersonInput, PersonUpdateInput } from './person';
import { Course } from './course';

export interface Catechist extends Omit<Person, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechist: Course[];
}

export interface CatechistInput extends Omit<PersonInput, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechist: string[];
}

export interface CatechistUpdateInput extends Omit<PersonUpdateInput, 'isVolunteer' | 'missingSacraments'> {
  coursesAsCatechist?: string[];
}
