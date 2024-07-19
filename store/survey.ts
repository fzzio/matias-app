import { registerInDevtools, Store } from "pullstate";
import { Person, Location, Catechizand, Catechist } from "@/types";

interface PersonForm {
  name: string;
  sacraments: string[];
  volunteer: boolean;
  birthDate: Date;
}

interface SurveyState {
  selectedLocation: Location | null;
  peopleCount: number;
  catechizands: Catechizand[];
  catechists: Catechist[];
  otherPeople: PersonForm[];
}

export const SurveyStore = new Store<SurveyState>({
  selectedLocation: null,
  peopleCount: 0,
  catechizands: [],
  catechists: [],
  otherPeople: [],
});

registerInDevtools({
  SurveyStore,
});