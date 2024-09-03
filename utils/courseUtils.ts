import { Course, CourseInput, CourseUpdateInput } from '@/types';
import { jsonToCatechist } from './catechistUtils';
import { jsonToCatechumen } from './catechumenUtils';

export function jsonToCourse(json: any): Course {
  return {
    ...json,
    catechists: json.catechists ? json.catechists.map(jsonToCatechist) : [],
    catechumens: json.catechumens ? json.catechumens.map(jsonToCatechumen) : [],
  };
}

export function courseToInput(course: Course): CourseInput {
  return {
    year: course.year,
    room: course.room,
    catechismLevel: course.catechismLevel.id,
    catechists: course.catechists.map(ct => ct.id),
    catechumens: course.catechumens.map(c => c.id),
    location: course.location.id,
    description: course.description,
  };
}

export function catechumenToUpdateInput(course: Course): CourseUpdateInput {
  return {
    ...courseToInput(course),
    id: course.id,
  };
}
