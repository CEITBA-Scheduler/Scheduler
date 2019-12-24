import { Injectable } from '@angular/core';
import { Materia } from './materia';
import { MateriaComisiones} from './materia-comisiones'
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombinacionDeHorarioService {
  materias = new BehaviorSubject<Materia[]>([]);
  materiasComisiones : Observable<MateriaComisiones[]>;
  constructor() { 
    
  }
  getMaterias(){
    return this.materias;
  }
  updateMaterias(newMaterias : Materia[]){
    this.materias.next(newMaterias);
  }
  updateMateriasComisiones(){

  }
}
