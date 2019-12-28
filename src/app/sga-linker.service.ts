import { Injectable } from '@angular/core';
import { Subject, Comission, Timeblock } from './materia';
import {Time} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  AllSubjects: { [id: string] : Subject; } = {};

  constructor() { }

  getComissions(materia: Subject): { [letter: string]: Comission; } {
    if (materia.code === "21.04"){
      const horario1: Timeblock = {
        day:"Lunes", start : {hours: 11, minutes: 0}, end: {hours: 15, minutes: 0}
      };
      const horario2: Timeblock = {
        day:"Jueves", start : {hours: 11, minutes: 0}, end: {hours: 15, minutes: 0}
      };
      // matematica 1
      return { A : { name: 'A', profesores: [
          'Profesor 1',
          'Profesor 2'
          ], schedule : [horario1, horario2]
          },
          B : { name: 'B', profesores: [
            'Profesor 3',
            'Profesor 4'
          ], schedule: [horario1, horario2]
        }   
        };
    }
  }

  
}
