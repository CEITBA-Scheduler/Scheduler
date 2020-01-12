import { ICombination, ICombinationSubject, ICommission, ITimeblock } from './algorithm-interface';

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
