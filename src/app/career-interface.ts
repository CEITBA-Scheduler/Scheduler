export interface ICareerSubject {
  subjectName: string;
  subjectCode: string;
  credits: number;
  dependencies: string[];
}

export interface ICareerTerm {
  year: string;
  period: string;
  subjects: ICareerSubject[];

  addSubject(subject: ICareerSubject): ICareerTerm;
}

export interface ICareerCycle {
  name: string;
  terms: ICareerTerm[];

  addTerm(term: ICareerTerm): ICareerCycle;
}

export interface ICareerPlan {
  name: string;
  career: string;
  degreeLevel: string;
  cycles: ICareerCycle[];

  addCycle(cycle: ICareerCycle): ICareerPlan;
}
