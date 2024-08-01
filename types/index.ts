export interface CatechismLevel {
  id: string;
  name: string;
}

export interface Sacrament {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  year: string;
  catechismLevel: CatechismLevel;
  location: Location;
}

export interface Person {
  id: string;
  idCard?: string;
  name: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
  sacraments: Sacrament[];
  isVolunteer?: boolean;
}

export interface Catechumen extends Omit<Person, 'isVolunteer'>{
  coursesAsCatechumen: Course[];
}

export interface Catechist extends Omit<Person, 'isVolunteer'>{
  coursesAsCatechist: Course[];
}

export interface Location {
  id: string;
  name: string;
}

export interface PersonInput {
  id?: string;
  idCard?: string;
  name: string;
  lastName: string;
  birthDate?: Date;
  email?: string;
  phone?: string;
  sacraments: string[];
  isVolunteer?: boolean;
}

export interface Survey {
  name: string;
  contact: string;
  address: string;
}
