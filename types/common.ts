export interface BaseEntity {
  id: string;
}

export interface NamedEntity extends BaseEntity {
  name: string;
}

export interface CatechismLevel extends NamedEntity {}
export interface Sacrament extends NamedEntity {}
export interface Location extends NamedEntity {}

export interface SacramentReport {
  sacrament: Sacrament,
  missingCount: number
}

export interface ReportLocation {
  location: Location;
  sacramentsReport: SacramentReport[];
}
