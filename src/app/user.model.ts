import { UserSelection } from './materia';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  userSelection?: FirestoreCommissionSelection[];
}

export interface FirestoreCommissionSelection{
  subjectCode: string;
  subjectName: string;
  commissions: string[];
}