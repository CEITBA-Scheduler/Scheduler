import {Time} from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Subject {
    name: string;
    code: string;    
    search: string;
    commissions?: Commission[];
    priority?: number;
}

export interface Timeblock {
    day: string;
    start: Time;
    end: Time;
    classroom?: string;
    building?: string;
}

export interface Commission {
    name: string;
    professors: string[];
    subject?: Subject;
    schedule: Timeblock[];
    people?: number[]; // personas que eligieron la comision como opcion 1, 2 y 3
}

export interface SubjectCommissions {
  subject: Subject; // materia elegida
  commissions?: Commission[]; // comisiones de la elección
}

export interface UserSelection {
  selection: SubjectCommissions[];
  noCourseTime: Timeblock[];
}
