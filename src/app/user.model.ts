import { UserSelection } from './materia';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  userSelection?: FirestoreCommissionSelection[];
  tickboxSelection?: TickboxSelection;
  plan?: string;
  career?: string;
}

export interface FirestoreCommissionSelection{
  subjectCode: string;
  subjectName: string;
  commissions: string[];
}

export interface TickboxSelection{
  superposition: boolean;
  freeday: boolean;
  buildingChange: boolean;
  travelTime: boolean;
}