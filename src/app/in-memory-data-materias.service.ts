import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api'

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataMateriasService implements InMemoryDbService {
  createDb(){
    var materias = [
      { codigo: "22.04", nombre: "Algebra Lineal", search: ""},
      { codigo: "21.04", nombre: "Mátematica I", search: ""},
      { codigo: "42.04", nombre: "Quimica I", search: ""},
      { codigo: "22.04", nombre: "Formación general I", search: ""},
      { codigo: "22.06", nombre: "Formación general II", search: ""},
    ]

    for (let materia in materias){
      var concat = materias[materia].codigo + materias[materia].nombre;
      materias[materia].search = concat.toString().toLowerCase();
    }

    return {materias};
  }
}
