import { registerInDevtools, Store } from "pullstate";
import { Location, Catechist, Sacrament, PersonInput } from "@/types";

export interface SurveyState {
  catechists: Catechist[];
  selectedLocation: Location | null;
  householdSize: number;
  catechumens: PersonInput[];
  otherPeople: PersonInput[];
  observations: string;
  sacraments: Sacrament[];
}

export const SurveyStore = new Store<SurveyState>({
  catechists: [],
  selectedLocation: null,
  householdSize: 0,
  catechumens: [],
  otherPeople: [],
  observations: "",
  sacraments: [],
});

registerInDevtools({
  SurveyStore,
});

export const updateCatechists = (catechists: Catechist[]) => {
  SurveyStore.update(s => { s.catechists = catechists; });
};

export const updateSelectedLocation = (location: Location | null) => {
  SurveyStore.update(s => { s.selectedLocation = location; });
};

export const updateHouseholdSize = (size: number) => {
  SurveyStore.update(s => { s.householdSize = size; });
};

export const updateCatechumens = (catechumens: PersonInput[]) => {
  SurveyStore.update(s => { s.catechumens = catechumens; });
};

export const updateOtherPeople = (otherPeople: PersonInput[]) => {
  SurveyStore.update(s => { s.otherPeople = otherPeople; });
};

export const updateObservations = (observations: string) => {
  SurveyStore.update(s => { s.observations = observations; });
};

export const updateSacraments = (sacraments: Sacrament[]) => {
  SurveyStore.update(s => { s.sacraments = sacraments; });
};

export const clearSurvey = () => {
  updateCatechists([]);
  updateSelectedLocation(null);
  updateHouseholdSize(0);
  updateCatechumens([]);
  updateOtherPeople([]);
  updateObservations("");
  updateSacraments([]);
};
