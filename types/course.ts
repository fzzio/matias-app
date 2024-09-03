import { BaseEntity, CatechismLevel, Location } from './common';
import { Catechist } from './catechist';
import { Catechumen } from './catechumen';

export interface Course extends BaseEntity {
  year: string;
  room: string;
  catechismLevel: CatechismLevel;
  catechists: Catechist[];
  catechumens: Catechumen[];
  location: Location;
  description: string;
}

export interface CourseInput {
  year: string;
  room: string;
  catechismLevel: string;
  catechists: string[];
  catechumens: string[];
  location: string;
  description: string;
}

export interface CourseUpdateInput extends Partial<CourseInput> {
  id: string;
}
