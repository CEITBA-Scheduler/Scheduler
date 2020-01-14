import { ICombination, ICombinationSubject, ICommission, ITimeblock, ISubject, Weekday } from './algorithm-interface';
import { IPriority, PriorityTypes } from './algorithm-interface';

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

  constructor(type: PriorityTypes, weight: number, exclusive: boolean, value: any = null, code: string = '') {
    this.type = type;
    this.weight = weight;
    this.exclusive = exclusive;
    this.relatedSubjectCode = code;
    this.value = value;
  }

  isExclusive(): boolean {
    return this.exclusive;
  }
}
