import { Injectable } from '@angular/core';
import { Subject } from './materia';
import { MateriaComisiones} from './materia-comisiones'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SgaLinkerService } from './sga-linker.service';

/**
Este servicio administra la información común llenada
en los distintos formularios, esto incluye

- Formulario de materias (subject-selector)
- Formulario de comisiones (commission-selector)
*/

@Injectable({
  providedIn: 'root'
})
export class CombinacionDeHorarioService {
  subjectData: BehaviorSubject<Subject[]> = new BehaviorSubject<Subject[]>([]);

  materiasComisiones: Observable<MateriaComisiones[]>;

  constructor(private sgaLinkerService: SgaLinkerService) {
  }
  getMaterias(): Observable<Subject[]> {
    return this.subjectData.asObservable();
  }
  setSubjectData(data: Observable<Subject[]>) {
    data.subscribe((subjects: Subject[]) => {
      this.subjectData.next(subjects);
    });

    this.subjectData.subscribe(subjects => {
      for (let subject of subjects) {
        subject.commissions = this.sgaLinkerService.getCommissions(subject);
      }
    });
  }
  /*
  this.subjects.subscribe(materias =>{
        this.commissions = {};
        for (let materia of materias){
          this.commissions[materia.code] = this.sgaLinkerService.getCommissions(materia);
        }
      });
  **/
}
