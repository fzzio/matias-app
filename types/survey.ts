import { BaseEntity, Location } from './common';
import { Person } from './person';
import { Catechumen } from './catechumen';
import { Catechist } from './catechist';

export interface SurveyBase {
  address?: string;
}

export interface Survey extends BaseEntity, SurveyBase {
  people: Person[];
  catechumens: Catechumen[];
  catechists: Catechist[];
  location: Location;
  householdSize: string;
  observations?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SurveyInput extends SurveyBase {
  people: string[];
  catechumens: string[];
  catechists: string[];
  location: string;
  householdSize: string;
  observations?: string;
}

export interface SurveyUpdateInput extends Partial<SurveyInput> {
  id: string;
}
