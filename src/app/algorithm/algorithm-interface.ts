import { Priority } from './algorithm-object';

/**
 * Contains information for a single combination. This object should
 * be graphable in Calendar component if the SUBJECTS object is at hand.
 *
 * SUBJECTS should contain all subjects in an array.
 */
export interface ICombination {
  weight: number;
  priorities: number[];
  subjects: ICombinationSubject[];

  getTimeblocksByDay(day: Weekday): ITimeblock[];
  getFreeDays(): Weekday[];
  hasPriorities(): boolean;
}

export interface ICombinationSubject {
  name: string;
  code: string;
  search: string;
  professors: string[];
  commissionName: string;
  commissionTimes: ITimeblock[];

  getTimeblocksByDay(day: Weekday): ITimeblock[];
  getAllTimeblocks(): ITimeblock[];
  getFreeDays(): Weekday[];
  hasProfessors(): boolean;
  hasCommissionTimes(): boolean;
}

/**
 * Contains information relating to a single subject. Commissions may
 * be empty array due to how SGA stores inactive subjects (0 commissions).
 *
 * It is required that commissions contain property field since a Subject should
 * contain said information lest it be a SubjectSelection class. If commissions should
 * not need exist then SubjectSelection class may be used.
 */
export interface ISubject {
  name: string;
  code: string;
  search: string;
  commissions: ICommission[];

  hasCommissions(): boolean;
  addCommission(commission: ICommission): void;
  addCommissions(commissions: ICommission[]): void;
}

/**
 * Contains information relating to a single commission!
 *
 * @label property contains commission name. Is usually a single capitalized letter.
 */
export interface ICommission {
  label: string;
  subjectCode: string;
  professors: string[];
  schedule: ITimeblock[];

  getFreeDays(): Weekday[];
}

/**
 * Contains information relating to a single scheduled class/event.
 *
 * start and end properties are numbers and correspond to hours of the day (0-24)
 */
export enum Weekday {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  ANY
}

export interface ITimeblock {
  day: Weekday;
  start: number;  // 19.5 == 19:30hs
  end: number;
  building?: string;
  classroom?: string;

  setBuilding(value: string): ITimeblock;
  setClassRoom(value: string): ITimeblock;
  endToHHmm(): string;
  startToHHmm(): string;
  overlaps(other: ITimeblock): number;
  travels(other: ITimeblock): number;
  sharesLocationWith(other: ITimeblock): boolean;
  duration(): number;
  getStartMinutes(): number;
  getStartHours(): number;
  getEndMinutes(): number;
  getEndHours(): number;
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
  MULTIPLE = 'Multiple',
  COMMISSION = 'Commission',
  PROFESSOR = 'Professor',
  LOCATION = 'Location',
  BUSYTIME = 'BusyTime',
  FREEDAY = 'FreeDay',
  SUPERPOSITION = 'Superposition',
  TRAVEL = 'BuildingTravel'
}

export interface IPriority {
  type: PriorityTypes;
  weight: number;
  relatedSubjectCode: string;
  value: string | ITimeblock[] | number | IPriority[];

  hasSubjectRelated(): boolean;
  isExclusive(): boolean;

  setExclusive(value: boolean): IPriority;
  setWeight(value: number): IPriority;
  setCode(value: string): IPriority;
  setValue(value: any): IPriority;
}

/**
 * SubjectSelection represent a subject being selected by the user to
 * be used in the algorithm to produce the current schedule.
 * User must order them.
 */
export interface ISubjectSelection {
  code: string;
  weight: number;
}

/**
 * Type Definition for the callable functions used in the algorithms
 */
export type VerifierFunction = (combination: ICombination) => boolean;
export type Transform = (value: number) => number;
