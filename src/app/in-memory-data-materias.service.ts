import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api'
import { ENGINE_METHOD_NONE } from 'constants';
import { Subject } from 'rxjs';
import { Time } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataMateriasService implements InMemoryDbService {
  createDb(){
    var materias = [
      { code: "22.04", name: "Algebra Lineal", search: ""},
      { code: "21.04", name: "Mátematica I", search: ""},
      { code: "42.04", name: "Quimica I", search: ""},
      { code: "22.04", name: "Formación general I", search: ""},
      { code: "22.06", name: "Formación general II", search: ""},
    ];
/*, comissions:
        [
          {name: "A", profesores: ["Fulano"], subject: new Subject(), schedule:
            [
              {dia: "Lunes", start: {minutes: 0, hours: 11}, end: {minutes: 0, hours: 13}},
              {dia: "Martes", start: {minutes: 0, hours: 14}, end: {minutes: 0, hours: 16}}
            ]
          }
        ]},*/
    for (let materia in materias){
      var concat = materias[materia].code + materias[materia].name;
      materias[materia].search = concat.toString().toLowerCase();
    }

    return {materias};
  }
}
