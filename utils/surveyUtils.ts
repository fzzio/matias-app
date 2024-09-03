import { Survey, SurveyInput, SurveyUpdateInput } from '@/types';
import { parseDateString } from './dateUtils';
import { jsonToCatechist } from './catechistUtils';
import { jsonToCatechumen } from './catechumenUtils';
import { jsonToPerson } from './personUtils';

export function jsonToSurvey(json: any): Survey {
  return {
    ...json,
    createdAt: json.createdAt ? parseDateString(json.createdAt) : undefined,
    updatedAt: json.updatedAt ? parseDateString(json.updatedAt) : undefined,
    catechists: json.catechists ? json.catechists.map(jsonToCatechist) : [],
    catechumens: json.catechumens ? json.catechumens.map(jsonToCatechumen) : [],
    people: json.people ? json.people.map(jsonToPerson) : [],
  };
}

export function surveyToInput(survey: Survey): SurveyInput {
  return {
    householdSize: survey.householdSize,
    observations: survey.observations,
    people: survey.people.map(p => p.id),
    catechumens: survey.catechumens.map(c => c.id),
    catechists: survey.catechists.map(ct => ct.id),
    location: survey.location.id
  };
}

export function catechumenToUpdateInput(survey: Survey): SurveyUpdateInput {
  return {
    ...surveyToInput(survey),
    id: survey.id,
  };
}
