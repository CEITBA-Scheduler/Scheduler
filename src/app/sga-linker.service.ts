import { Injectable } from '@angular/core';
import { Subject, Comission, Timeblock } from './materia';
import {Time} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  constructor() { }

  obtenerMaterias(planes: string[]){

  }

  obtenerComisiones(materia: Subject): Comission[] {
    if (materia.code === "21.04"){

      const horario1: Timeblock = {
        dia:"Lunes", start : {hours: 11, minutes: 0}, end: {hours: 15, minutes: 0}
      };
      const horario2: Timeblock = {
        dia:"Jueves", start : {hours: 11, minutes: 0}, end: {hours: 15, minutes: 0}
      };
      // matematica 1
      return [
        { name: '', profesores: [
          'Profesor 1',
          'Profesor 2'
        ], schedule : [horario1, horario2]
        }
      ];
    }
  }

}
