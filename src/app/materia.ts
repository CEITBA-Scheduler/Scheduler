import {Time} from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Subject {
    name: string;
    code: string;    search: string;
    commissions?: Commission[];
    priority?: number;
}

export interface Timeblock {
    day: string;
    start: number;
    end: number;
    classroom?: string;
    building?: string;
}

export interface Commission {
    name: string;
    professors: string[];
    subject?: Subject;
    schedule: Timeblock[];
}

export interface SubjectCommissions {
  subject: Subject; // materia elegida
  commissions?: Commission[]; // comisiones de la elección
}

export interface UserSelection {
  selection: SubjectCommissions[];
  noCourseTime: Timeblock[];
}
