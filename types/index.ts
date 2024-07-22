export interface Sacrament {
  id: string;
  name: string;
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
  isCatechist?: boolean;
  isVolunteer?: boolean;
}

export interface Catechumen extends Person {}

export interface Catechist extends Person {}

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
  sacraments: string[];
  isVolunteer?: boolean;
}

export interface Survey {
  name: string;
  contact: string;
  address: string;
}
