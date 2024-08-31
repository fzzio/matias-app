import { registerInDevtools, Store } from "pullstate";
import { Location, Catechist, Sacrament, PersonInput, Catechumen } from "@/types";
import { parseDate } from "@/utils/calculate";

export interface SurveyState {
  catechists: Catechist[];
  location: Location | null;
  householdSize: number;
  catechumens: Catechumen[];
  people: PersonInput[];
  observations: string;
  sacraments: Sacrament[];
  missingSacraments: Sacrament[];
}

export const SurveyStore = new Store<SurveyState>({
  catechists: [],
  location: null,
  householdSize: 0,
  catechumens: [],
  people: [],
  observations: "",
  sacraments: [],
  missingSacraments: [],
});

registerInDevtools({
  SurveyStore,
});

export const updateCatechists = (catechists: Catechist[]) => {
  SurveyStore.update(s => {
    s.catechists = catechists.map(catechist => ({
      ...catechist,
      birthDate: parseDate(catechist.birthDate as unknown as string)
    }));
  });
};

export const updateSelectedLocation = (location: Location | null) => {
  SurveyStore.update(s => { s.location = location; });
};

export const updateHouseholdSize = (size: number) => {
  SurveyStore.update(s => { s.householdSize = size; });
};

export const updateCatechumens = (catechumens: Catechumen[]) => {
  SurveyStore.update(s => {
    s.catechumens = catechumens.map(catechumen => ({
      ...catechumen,
      birthDate: parseDate(catechumen.birthDate as unknown as string)
    }));
  });
};

export const updateCatechumenData = (updatedCatechumen: Catechumen | null) => {
  if (!updatedCatechumen) return;

  SurveyStore.update(s => {
    const index = s.catechumens.findIndex(c => c.id === updatedCatechumen.id);
    if (index !== -1) {
      s.catechumens[index] = updatedCatechumen;
    }
  });
};

export const updatePeople = (people: PersonInput[]) => {
  SurveyStore.update(s => { s.people = people; });
};

export const updateObservations = (observations: string) => {
  SurveyStore.update(s => { s.observations = observations; });
};

export const updateSacraments = (sacraments: Sacrament[]) => {
  SurveyStore.update(s => { s.sacraments = sacraments; });
};
export const updateMissingSacraments = (missingSacraments: Sacrament[]) => {
  SurveyStore.update(s => { s.missingSacraments = missingSacraments; });
};

export const clearSurvey = () => {
  updateCatechists([]);
  updateSelectedLocation(null);
  updateCatechumenData(null);
  updateHouseholdSize(0);
  updateCatechumens([]);
  updatePeople([]);
  updateObservations("");
  updateSacraments([]);
  updateMissingSacraments([]);
};
