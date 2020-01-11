/**
 * Contains information for a single combination. This object should
 * be graphable in Calendar component if the SUBJECTS object is at hand.
 *
 * SUBJECTS should contain all subjects in an array.
 */
export interface Combination {
  weight: number;
  priorities: number[];
  subjects: Subject[];
}

/**
 * Contains information relating to a single subject. Commissions may
 * be empty array due to how SGA stores inactive subjects (0 commissions).
 *
 * It is required that commissions contain property field since a Subject should
 * contain said information lest it be a SubjectSelection class. If commissions should
 * not need exist then SubjectSelection class may be used.
 */
export interface Subject {
  name: string;
  code: string;
  search: string;
  commissions: Commission[] | Commission;
}

/**
 * Contains information relating to a single commission!
 *
 * @label property contains commission name. Is usually a single capitalized letter.
 */
export interface Commission {
  label: string;
  subjectCode: string;
  professors: string[];
  schedule: Timeblock[];
}

/**
 * Contains information relating to a single scheduled class/event.
 *
 * start and end properties are numbers and correspond to hours of the day (0-24)
 */
export enum WeekDay {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}

export interface Timeblock {
  day: WeekDay;
  start: number;  // 19.5 == 19:30hs
  end: number;
  building?: string;
  classroom?: string;
}

/**
 * Contains information for a single priority. They can be of type
 * None, Commission, Professor, Location, BusyTime or Superposition.
 *
 * At least one superposition type should be included in priorities
 * to indicate maximum number of superposed hours between any two
 * schedules. Default value should be 0.
 */
export enum PriorityTypes {
  NONE = 'None',
  COMMISSION = 'Commission',
  PROFESSOR = 'Professor',
  LOCATION = 'Location',
  BUSYTIME = 'BusyTime',
  FREEDAY = 'FreeDay',
  SUPERPOSITION = 'Superposition'
}

export interface Priority {
  type: PriorityTypes;
  isExclusive: boolean;
  weight: number;
  relatedSubjectCode?: string;
  value?: string | Timeblock[] | number;
}

/**
 * SubjectSelection represent a subject being selected by the user to
 * be used in the algorithm to produce the current schedule.
 * User must order them.
 */
export interface SubjectSelection {
  code: string;
  weight: number;
  // commissions property should not be used. It is unused for present algorithm although future implementations may require it.
  commissions?: Commission[];
}
