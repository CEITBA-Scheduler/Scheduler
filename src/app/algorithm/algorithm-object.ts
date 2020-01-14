import { ICombination, ICombinationSubject, ICommission, ITimeblock, ISubject, Weekday } from './algorithm-interface';
import { ISubjectSelection, IPriority, PriorityTypes } from './algorithm-interface';

export class CombinationSubject implements ICombinationSubject {
  public name: string;
  public code: string;
  public search: string;
  public professors: string[];
  public commissionName: string;
  public commissionTimes: ITimeblock[];

  constructor(name: string, code: string, professors: string[], commissionName: string, commissionTimes: ITimeblock[]) {
    this.name = name;
    this.code = code;
    this.professors = professors;
    this.commissionName = commissionName;
    this.commissionTimes = commissionTimes;
  }
}

export class Combination implements ICombination {
  public weight: number;
  public priorities: number[];
  public subjects: ICombinationSubject[];

  constructor(weight = NaN, priorities = [], subjects = []) {
    this.weight = weight;
    this.priorities = priorities;
    this.subjects = subjects;
  }
}

export class Subject implements ISubject {
  public name: string;
  public code: string;
  public search: string;
  public commissions: ICommission[];

  constructor(subjectName: string, subjectCode: string, commissions: ICommission[] = [], search: string = '') {
    this.name = subjectName;
    this.code = subjectCode;
    this.search = search;
    this.commissions = commissions;
  }

  addCommission(commission: ICommission) {
    this.commissions.push(commission);
  }

  addCommissions(commissions: ICommission[]) {
    for (const commission of commissions) {
      this.addCommission(commission);
    }
  }
}

export class Commission implements ICommission {
  public label: string;
  public subjectCode: string;
  public professors: string[];
  public schedule: ITimeblock[];

  constructor(commissionName: string, subjectCode: string, schedule: ITimeblock[], professors: string[] = []) {
    this.label = commissionName;
    this.subjectCode = subjectCode;
    this.professors = professors;
    this.schedule = schedule;
  }
}

export class Timeblock implements ITimeblock {
  public day: Weekday;
  public start: number;
  public end: number;
  public building: string;
  public classroom: string;

  constructor(day: Weekday, start: number, end: number, building: string, classroom: string) {
    this.day = day;
    this.start = start;
    this.end = end;
    this.building = building;
    this.classroom = classroom;
  }

  /**
   * Converts the string representation of the time to a number value
   * @param time  String value with the time "19:30"
   * @returns     Returns an equivalent time value as a float number => 19.5
   */
  static parseHHmm(time: string): number {
    const hourMinute: string[] = time.split(':', 2);
    return Number(hourMinute[0]) + Number(hourMinute[1]) / 60;
  }

  endToHHmm(): string {
    const minutes = Math.round(60 * (this.end - Math.floor(this.end)));
    const hours = Math.floor(this.end);
    return minutes < 10.0 / 60.0 ? hours + ':' + '0' + minutes : hours + ':' + minutes;
  }

  startToHHmm(): string {
    const minutes = Math.round(60 * (this.start - Math.floor(this.start)));
    const hours = Math.floor(this.start);
    return minutes < 10.0 / 60.0 ? hours + ':' + '0' + minutes : hours + ':' + minutes;
  }

  /**
   * Converts the number representation of the time interval to a string value ready for UI display.
   * @param Timeblock Requires properties start and end.
   * @returns     String value with the time interval. In example: "18:00-19:30"
   */
  intervalToHHmm(): string {
    return this.startToHHmm() + '-' + this.endToHHmm();
  }
}

export class Priority implements IPriority {
  public type: PriorityTypes;
  public weight: number;
  public relatedSubjectCode: string;
  public value: string | ITimeblock[] | number;

  private exclusive: boolean;

  constructor(type: PriorityTypes, value: any = null) {
    this.type = type;
    this.value = value;
    this.weight = NaN;
    this.exclusive = false;
    this.relatedSubjectCode = '';
  }

  /**
   * Computes the corresponding weight for the ordered array of priorities,
   * based on each priority's index inside the ordered array.
   * @param priorities  List/Array of priorities
   */
  public static generateWeightedPriorities(priorities: Priority[]): Priority[] {
    for (let priorityIndex = 0 ; priorityIndex < priorities.length ; priorityIndex++) {
      priorities[priorityIndex].setWeight(priorities.length - priorityIndex);
    }
    return priorities;
  }

  /**
   * Commission Priority generator or factory method
   * @param commission    The chosen commission
   * @param subjectCode   The subjectCode from the subject's commission
   */
  public static gpCommission(commission: string, subjectCode: string): Priority {
    return new Priority(PriorityTypes.COMMISSION, commission).setCode(subjectCode);
  }

  /**
   * Professor Priority generator or factory method
   * @param professor     The chosen professor
   * @param subjectCode   The subject's code
   */
  public static gpProfessor(professor: string, subjectCode: string): Priority {
    return new Priority(PriorityTypes.PROFESSOR, professor).setCode(subjectCode);
  }

  /**
   * Location Priority generator or factory method
   * @param location      The chosen location
   */
  public static gpLocation(location: string): Priority {
    return new Priority(PriorityTypes.LOCATION, location);
  }

  /**
   * BusyTime Priority generator or factory method
   * @param timeblocks    Array of busy time blocks
   */
  public static gpBusyTime(timeblocks: ITimeblock[]): Priority {
    return new Priority(PriorityTypes.BUSYTIME, timeblocks);
  }

  /**
   * FreeDay Priority generator or factory method
   */
  public static gpFreeDay(): Priority {
    return new Priority(PriorityTypes.FREEDAY);
  }

  /**
   * Superposition Priority generator or factory method
   * @param maxSuperpositionHours Maximum amount of superposition hours allowed
   */
  public static gpSuperposition(maxSuperpositionHours: number): Priority {
    return new Priority(PriorityTypes.SUPERPOSITION, maxSuperpositionHours);
  }

  /**
   * Travel Priority generator or factory method
   * @param travelTime  Maximum amount of time allowed for travelling
   */
  public static gpTravel(travelTime: number): Priority {
    return new Priority(PriorityTypes.TRAVEL, travelTime);
  }

  /**
   * Determines whether the priority is exclusive or not.
   * @returns boolean
   */
  isExclusive(): boolean {
    return this.exclusive;
  }

  /**
   * Sets the current value of exclusivity.
   * @param value   Boolean value, should be exclusive or not
   */
  setExclusive(value: boolean): Priority {
    this.exclusive = value;
    return this;
  }

  /**
   * Sets the current value of the weight.
   * @param value   Number value, the current weight
   */
  setWeight(value: number): Priority {
    this.weight = value;
    return this;
  }

  /**
   * Sets the current value of the subject code,
   * @param value   String value, the related subject code
   */
  setCode(value: string): Priority {
    this.relatedSubjectCode = value;
    return this;
  }

  /**
   * Sets the current priority value.
   * @param value   Any type of value according to the priority type chosen
   */
  setValue(value: any): Priority {
    this.value = value;
    return this;
  }
}

export class SubjectSelection implements ISubjectSelection {
  public code: string;
  public weight: number;

  constructor(code: string, weight: number) {
    this.code = code;
    this.weight = weight;
  }

  /**
   * SubjectSelection Factory creates a list or array of SubjectSelection instances
   * by getting the list of subjectCodes and generating their weights using the array's index.
   * @param selections  String array with the subject codes
   * @returns           Array of SubjectSelection
   */
  public static generateSelectionByArray(selections: string[]): SubjectSelection[] {
    const subjectSelections: SubjectSelection[] = [];
    for (let selectionIndex = 0 ; selectionIndex < selections.length ; selectionIndex++) {
      subjectSelections.push(
        new SubjectSelection(
          selections[selectionIndex],
          selections.length - selectionIndex
        )
      );
    }
    return subjectSelections;
  }
}
