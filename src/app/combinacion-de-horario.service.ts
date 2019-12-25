import { Injectable } from '@angular/core';
import { Subject } from './materia';
import { MateriaComisiones} from './materia-comisiones'
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombinacionDeHorarioService {
  materias = new BehaviorSubject<Subject[]>([]);
  materiasComisiones : Observable<MateriaComisiones[]>;
  constructor() { 
    
  }
  getMaterias(){
    return this.materias;
  }
  updateMaterias(newMaterias : Subject[]){
    this.materias.next(newMaterias);
  }
  updateMateriasComisiones(){
  }
}
