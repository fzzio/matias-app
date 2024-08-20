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
  room: string;
  catechismLevel: CatechismLevel;
  catechists: Catechist[];
  catechumens: Catechumen[];
  location: Location;
  description: string;
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
  missingSacraments: Sacrament[];
  isVolunteer?: boolean;
}

export interface Catechumen extends Omit<Person, 'isVolunteer'>{
  coursesAsCatechumen: Course[];
  location: Location;
  address?: string;
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
  missingSacraments: string[];
  isVolunteer?: boolean;
}

export interface CatechistInput {
  id?: string;
  idCard?: string;
  name: string;
  lastName: string;
  birthDate?: Date;
  email?: string;
  phone?: string;
  sacraments: string[];
  location?: string; // TODO to required
}

export interface Survey {
  name: string;
  contact: string;
  address: string;
}
