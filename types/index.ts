export interface Person {
  id: string;
  name: string;
  lastName: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface Catechizand extends Person {}

export interface Catechist extends Person {}