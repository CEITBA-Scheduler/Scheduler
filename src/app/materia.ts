
import { ICombinationSubject, ITimeblock, Weekday, ISubject } from './algorithm/algorithm-interface';
import { Combination, Timeblock as TimeblockAlgo } from './algorithm/algorithm-object';

import {Time} from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { addMinutes } from 'date-fns';

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
export function generateTimeblockFromITimeblock(timeblock: ITimeblock): Timeblock {
  var weekday: string;

  if (timeblock.day === Weekday.MONDAY) {
    weekday = "Lunes";
  }else if(timeblock.day === Weekday.TUESDAY) {
    weekday = "Martes";
  }else if(timeblock.day === Weekday.WEDNESDAY) {
    weekday = "Miércoles";
  }else if(timeblock.day === Weekday.THURSDAY) {
    weekday = "Jueves";
  }else if(timeblock.day === Weekday.FRIDAY) {
    weekday = "Viernes";
  }else if(timeblock.day === Weekday.SATURDAY) {
    weekday = "Sabado";
  }else if(timeblock.day === Weekday.SUNDAY) {
    weekday = "Domingo";
  }

  return {
    day: weekday,
    start: {minutes: timeblock.getStartMinutes(), hours: timeblock.getStartHours()},
    end: {minutes: timeblock.getEndMinutes(), hours: timeblock.getEndHours()}
  };
}
export function generateSubjectCommissionsFromCombionation(combination: Combination) {
  var ans: SubjectCommissions[] = [];

  const getAllTimeblock = (timeblock: ITimeblock[]): Timeblock[] => {
    var ans: Timeblock[] = [];

    for (const tt of timeblock){
      ans.push(generateTimeblockFromITimeblock(tt));
    }

    return ans;
  }

  for (const subject of combination.subjects){
    ans.push(
      { subject:
        {
          name: subject.name,
          code: subject.code,
          search: subject.search
        },
        commissions: [
          {
            name: subject.commissionName,
            professors: subject.professors,
            schedule: getAllTimeblock(subject.getAllTimeblocks())
          }
        ]
      }
    )
  };
  return ans;
}
