import {
  ICombination,
  ICombinationSubject,
  ICommission,
  ITimeblock,
  ISubject,
  Weekday
} from './algorithm-interface';
import {
  ISubjectSelection,
  IPriority,
  PriorityTypes
} from './algorithm-interface';

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

  public static copyMany(manyCombinationSubjects: CombinationSubject[]): CombinationSubject[] {
    const newArray: CombinationSubject[] = [];
    for (const combinationSubject of manyCombinationSubjects) {
      newArray.push(CombinationSubject.copy(combinationSubject));
    }
    return newArray;
  }

  public static copy(combinationSubject: CombinationSubject): CombinationSubject {
    const newCombinationSubject = new CombinationSubject(
      combinationSubject.name,
      combinationSubject.code,
      combinationSubject.professors,
      combinationSubject.commissionName,
      combinationSubject.commissionTimes
    );

    return newCombinationSubject;
  }

  /**
   * Returns an array of timeblocks with the same day.
   * @param day The field's value for the timeblock's day
   */
  getTimeblocksByDay(day: Weekday): ITimeblock[] {
    const timeblocks: ITimeblock[] = [];

    for (const commissionTime of this.commissionTimes) {
      if (commissionTime.day === day) {
        timeblocks.push(commissionTime);
      }
    }

    return timeblocks;
  }

  /**
   * Returns an array of timeblocks
   */
  getAllTimeblocks(): ITimeblock[] {
    return this.commissionTimes;
  }

  /**
   * Returns an array of weekdays containing the free days
   * where the subject has no lectures.
   */
  getFreeDays(): Weekday[] {
    const freeDays: Weekday[] = [
      Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY,
      Weekday.THURSDAY, Weekday.FRIDAY
    ];

    for (const timeblock of this.commissionTimes) {
      const index = freeDays.indexOf(timeblock.day);
      if (index > -1) {
        freeDays.splice(index, 1);
      }
    }

    return freeDays;
  }

  /**
   * Returns whether the combination has or not professors.
   */
  hasProfessors(): boolean {
    return this.professors.length > 0;
  }

  /**
   * Returns whether the combination has or not commission times.
   */
  hasCommissionTimes(): boolean {
    return this.commissionTimes.length > 0;
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

  /**
   * Creates a new combination as a copy of the given one,
   * but it's reference independente from the other one.
   * @param combination   Original combination
   */
  public static copy(combination: Combination): Combination {
    const newCombination = new Combination(
      combination.weight,
      Object.assign([], combination.priorities),
      CombinationSubject.copyMany(combination.subjects)
    );
    return newCombination;
  }

  /**
   * Returns an array of all timeblocks with the same day field.
   * @param day   The user's chosen day value.
   */
  getTimeblocksByDay(day: Weekday): ITimeblock[] {
    let timeblocks: ITimeblock[] = [];

    for (const subject of this.subjects) {
      const subjectTimeblocks = subject.getTimeblocksByDay(day);
      if (subjectTimeblocks.length > 0) {
        timeblocks = timeblocks.concat(subjectTimeblocks);
      }
    }

    return timeblocks;
  }
  /**
   * Returns an array of weekday with the free days where
   * the combination has no lectures, by comparing the freedays
   * of each subject.
   */
  getFreeDays(): Weekday[] {
    const freeDaysCount = [0, 0, 0, 0, 0, 0, 0];
    const freeDays = [];

    for (const subject of this.subjects) {
      const subjectFreeDays = subject.getFreeDays();
      for (const subjectFreeDay of subjectFreeDays) {
        freeDaysCount[subjectFreeDay]++;
      }
    }

    for (let index = 0 ; index < freeDaysCount.length ; index++) {
      if (freeDaysCount[index] >= this.subjects.length) {
        freeDays.push(index);
      }
    }

    return freeDays;
  }

  /**
   * Returns true if the combination fulfills any
   * priority.
   */
  hasPriorities(): boolean {
    return this.priorities.length > 0;
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

  /**
   * Returns whether it has or not commissions this subject.
   */
  hasCommissions(): boolean {
    return this.commissions.length > 0;
  }

  /**
   * Adds a new commission to the subject.
   * @param   Instance of the new commission being added
   */
  addCommission(commission: ICommission) {
    this.commissions.push(commission);
  }

  /**
   * Adds an array of new commissions to the subject.
   * @param commissions   Array of new instances of commissions
   */
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

  /**
   * Returns an array of weekdays where the commission
   * has no lectures. This is only for this commission.
   */
  getFreeDays(): Weekday[] {
    const freeDays: Weekday[] = [
      Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY,
      Weekday.THURSDAY, Weekday.FRIDAY
    ];

    for (const timeblock of this.schedule) {
      const freeDay = freeDays.find(element => element === timeblock.day);
      if (freeDay) {
        const index = freeDays.indexOf(freeDay);
        freeDays.splice(index, 1);
      }
    }

    return freeDays;
  }
}

export class Timeblock implements ITimeblock {
  public day: Weekday;
  public start: number;
  public end: number;
  public building: string;
  public classroom: string;

  constructor(day: Weekday, start: number, end: number, building: string = '', classroom: string = '') {
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

  /**
   * Returns the amount of travelling time between two different
   * placed ITimeblocks. Should return 0.0 if no travelling.
   * @param other   The other ITimeblock to which is being compared
   */
  travels(other: ITimeblock): number {
    if (this.day === other.day) {
      if (!this.sharesLocationWith(other)) {
        if (this.overlaps(other) === 0.0) {
          if (this.end < other.start) {
            return other.start - this.end;
          } else if (this.start > other.end) {
            return this.start - other.end;
          }
        }
      }
    }

    // Share the same location, so no travelling time detected
    return 0.0;
  }

  /**
   * Verifies if both this and the other timeblock share
   * the same location.
   * @param other The other timeblock
   */
  sharesLocationWith(other: ITimeblock): boolean {
    if (this.building === other.building) {
      return true;
    } else {
      const buildingWords = this.building.split(' ');
      for (const buildingWord of buildingWords) {
        if (other.building.includes(buildingWord)) {
          return true;
        }
      }
    }

    // No special case of similar building has been detected
    return false;
  }

  /**
   * Returns the duration of the timeblock.
   */
  duration(): number {
    return this.end - this.start;
  }

  /**
   * Returns the amount of time in which both blocks overlap,
   * if returns 0.0 then there is no overlapping between both
   * blocks.
   * @param other     The other timeblock
   */
  overlaps(other: ITimeblock): number {
    let overlappingTime = 0.0;

    if (this.day === other.day) {
      if (this.start >= other.start && this.start <= other.end) {
        if (this.end <= other.end && this.end >= other.start) {
          overlappingTime = this.duration();
        } else {
          overlappingTime = other.end - this.start;
        }
      } else if (this.end <= other.end && this.end >= other.start) {
        if (this.start >= other.start && this.start <= other.end) {
          overlappingTime = this.duration();
        } else {
          overlappingTime = this.end - other.start;
        }
      } else if (this.start <= other.start && this.end >= other.end) {
        overlappingTime = other.duration();
      }
    }

    return overlappingTime;
  }

  /**
   * Sets the building field of the instance.
   * @param value   Building
   */
  setBuilding(value: string): Timeblock {
    this.building = value;
    return this;
  }

  /**
   * Sets the classroom field of the instance.
   * @param value   ClassRoom
   */
  setClassRoom(value: string): Timeblock {
    this.classroom = value;
    return this;
  }

  /**
   * Returns the end time as a formatted string.
   */
  endToHHmm(): string {
    const minutes = Math.round(60 * (this.end - Math.floor(this.end)));
    const hours = Math.floor(this.end);
    return minutes < 10.0 / 60.0 ? hours + ':' + '0' + minutes : hours + ':' + minutes;
  }

  /**
   * Returns the start time as a formatted string.
   */
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

  /**
   * Return the start minutes
   */
  getStartMinutes(): number {
    return Math.round(60 * (this.start - Math.floor(this.start)));
  }

  /**
   * Return the start hours
   */
  getStartHours(): number {
    return Math.floor(this.start);
  }

  /**
   * Return the end minutes
   */
  getEndMinutes(): number {
    return Math.round(60 * (this.end - Math.floor(this.end)));
  }

  /**
   * Return the end hours
   */
  getEndHours(): number {
    return Math.floor(this.end);
  }
}

export class Priority implements IPriority {
  public type: PriorityTypes;
  public weight: number;
  public relatedSubjectCode: string;
  public value: string | ITimeblock[] | number | IPriority[];

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
   * Multiple Priority generator or factory method
   * @param priorities Individual priorities of the multiple one
   */
  public static gpMultiple(priorities: IPriority[]): Priority {
    return new Priority(PriorityTypes.MULTIPLE, priorities);
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
  public static gpLocation(): Priority {
    return new Priority(PriorityTypes.LOCATION);
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
  public static gpFreeDay(day: Weekday): Priority {
    return new Priority(PriorityTypes.FREEDAY, day);
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
   * Returns whether the instance has a related subject
   * linked to the priority.
   */
  hasSubjectRelated(): boolean {
    return this.relatedSubjectCode !== '';
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
