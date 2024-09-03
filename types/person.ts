import { BaseEntity, Sacrament, Location } from './common';

export interface PersonBase {
  idCard?: string;
  name: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthDate?: Date;
}

export interface Person extends BaseEntity, PersonBase {
  sacraments: Sacrament[];
  missingSacraments: Sacrament[];
  isVolunteer?: boolean;
  location?: Location;
}

export interface PersonInput extends PersonBase {
  sacraments: string[];
  missingSacraments: string[];
  location?: string;
  isVolunteer?: boolean;
}

export interface PersonUpdateInput extends Partial<PersonInput> {
  id: string;
}
