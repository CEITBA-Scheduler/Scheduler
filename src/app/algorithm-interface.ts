/**
 * PossibleSchedules output of algorithm will be an array: Combination[].
 * @PossibleSchedules : Combination[].
 * Output of public method SchedulerAlgorithm()
 */

/**
 * Contains information for a single combination. This object should
 * be graphable in Calendar component if the SUBJECTS object is at hand.
 *
 * SUBJECTS should contain all subjects in an array.
 */
export interface Combination {
  weight: number;
  priorities: number[];
  commissions: Commission[];
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
  code: string;    search: string;
  commissions: Commission[];
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
export interface Timeblock {
  day: number; // 0 == Sunday, 1 == Monday ...
  start: number;  // 19.5 == 19:30hs
  end: number;
  building?: string;
  classroom?: string;
}

/**
 * Contains all information related to
 * the user's selection. priorities should be
 * obligatory property as it should have at least
 * a superposition priority to limit overlapping.
 */
export interface UserSelection {
  subjects: SubjectSelection[];
  priorities: Priority[];
}

/**
 * Contains information for a single priority. They can be of type
 * None, Commission, Professor, Location, BusyTime or Superposition.
 *
 * At least one superposition type should be included in priorities
 * to indicate maximum number of superposed hours between any two
 * schedules. Default value should be 0.
 */
export interface Priority {
  type: number; // TODO declare enum for priorities
  weight: number;
  isExclusive: boolean;
  // Below this line are values for priority!
  teachers?: string[];
  building?: string;
  value?: number; // for
  schedule?: Timeblock[];
}

/**
 * When the user selects a subject they must order
 * it. Ordering begins at 1. 1 represents a 'higher' weight.
 */
export interface SubjectSelection {
  code: string;
  ordering?: number;
  // commissions property should not be used. It is unused for present algorithm although future implementations may require it.
  commissions?: Commission[];
}

