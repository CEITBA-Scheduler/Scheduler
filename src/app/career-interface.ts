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
}

export interface ICareerCycle {
  name: string;
  terms: ICareerTerm[];
}

export interface ICareerPlan {
  name: string;
  career: string;
  degreeLevel: string;
  cycles: ICareerCycle[];
}
