export interface Person {
  id: string;
  name: string;
  lastName: string;
  sacraments: Sacrament[];
}

export interface Location {
  id: string;
  name: string;
}

export interface Catechizand extends Person {}

export interface Catechist extends Person {}

export interface Sacrament {
  id: string;
  name: string;
}
