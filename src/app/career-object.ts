import {
  ICareerSubject,
  ICareerTerm,
  ICareerCycle,
  ICareerPlan
} from './career-interface';

export class CareerSubject implements ICareerSubject {
  public subjectName: string;
  public subjectCode: string;
  public credits: number;
  public dependencies: string[];

  constructor(name: string, code: string, credits: number, dependencies: string[] = []) {
    this.subjectName = name;
    this.subjectCode = code;
    this.credits = credits;
    this.dependencies = dependencies;
  }

  /**
   * Adds a new dependency to the subject
   * @param dependency New dependency
   */
  addDependency(dependency: string): CareerSubject {
    this.dependencies.push(dependency);
    return this;
  }
}

export class CareerTerm implements ICareerTerm {
  public year: string;
  public period: string;
  public subjects: ICareerSubject[];

  constructor(year: string, period: string, subjects: ICareerSubject[] = []) {
    this.year = year;
    this.period = period;
    this.subjects = subjects;
  }

  /**
   * Adds a new subject to the term
   * @param subject New subject
   */
  addSubject(subject: ICareerSubject): CareerTerm {
    this.subjects.push(subject);
    return this;
  }
}

export class CareerCycle implements ICareerCycle {
  public name: string;
  public terms: ICareerTerm[];

  constructor(name: string, terms: ICareerTerm[] = []) {
    this.name = name;
    this.terms = terms;
  }

  /**
   * Adds a new term to the cycle
   * @param term New term
   */
  addTerm(term: ICareerTerm): CareerCycle {
    this.terms.push(term);
    return this;
  }
}

export class CareerPlan implements ICareerPlan {
  public name: string;
  public career: string;
  public degreeLevel: string;
  public cycles: ICareerCycle[];

  constructor(
    name: string,
    career: string,
    level: string,
    cycles: ICareerCycle[] = []) {
      this.name = name;
      this.career = career;
      this.degreeLevel = level;
      this.cycles = cycles;
  }

  /**
   * Adds a new cycle to the career plan.
   * @param cycle   Career cycle to be added
   */
  addCycle(cycle: ICareerCycle): CareerPlan {
    this.cycles.push(cycle);
    return this;
  }
}
