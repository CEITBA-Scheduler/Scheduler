import { Injectable } from '@angular/core';
import { Subject, SubjectCommissions, UserSelection, Commission } from './materia';
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
  // arreglo con las comisiones elegidas para cada materia
  subjectCommissions: { [id: string]: SubjectCommissions} = {}; // has all subjects
  subjectCommissionsBehavioural: BehaviorSubject<{ [id: string]: SubjectCommissions}> = new BehaviorSubject({});

  constructor(private sgaLinkerService: SgaLinkerService) {
    this.getCommissionsSelectedData().subscribe((data: {[id: string]: SubjectCommissions}) => {
        console.log("data of commissions selected updated: ");
        console.log(data);
      }
    );
  }
  getMaterias(): Observable<Subject[]> {
    return this.subjectData.asObservable();
  }
  setSubjectData(data: Observable<Subject[]>) {
    data.subscribe((subjects: Subject[]) => {
      this.subjectData.next(subjects);
    });

    this.subjectData.subscribe(subjects => {

      /// esta funcion se llama cuando cambian las materias elegidas
      for (let subject of subjects) {
        subject.commissions = this.sgaLinkerService.getCommissions(subject);

        if (!(subject.code in this.subjectCommissions)) {
          this.subjectCommissions[subject.code] = {
            subject : subject
          }
        }
      }
    });
  }
  setSubjectSelectedCommissions(subject: Subject, commissions: Observable<Commission[]>) {

    // se recibe un observable de comisiones que refleja las comisiones elegidas para una materia dada
    commissions.subscribe((coms: Commission[]) => {
      this.subjectCommissions[subject.code] = {
        subject : subject,
        commissions: coms
      }
      this.subjectCommissionsBehavioural.next(this.subjectCommissions);
    });
  }
  removeSubject(subject: Subject){
   delete this.subjectCommissions[subject.code];
   this.subjectCommissionsBehavioural.next(this.subjectCommissions);
  }
  // getCommissionsSelected(): SubjectCommissions[]{
  getCommissionsSelectedData(): Observable<{[id: string]: SubjectCommissions}> {
    return this.subjectCommissionsBehavioural.asObservable();
  }

  // }
}
