import { AlgorithmService } from './algorithm/algorithm.service';
import { Injectable } from '@angular/core';
import { Subject, SubjectCommissions, UserSelection, Commission } from './materia';
import { MateriaComisiones} from './materia-comisiones'
import { Observable, of, BehaviorSubject } from 'rxjs';
import { SgaLinkerService } from './sga-linker.service';
import { AuthService } from './auth.service';
import {
  SubjectSelection,
  Priority,
  Combination
} from './algorithm/algorithm-object';

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
  subjects: Subject[];
  // arreglo con las comisiones elegidas para cada materia
  subjectCommissions: { [id: string]: SubjectCommissions} = {}; // has all subjects
  subjectCommissionsBehavioural: BehaviorSubject<{ [id: string]: SubjectCommissions}> = new BehaviorSubject({});

  algorithmResults: Combination[]= [];
  hearts: string[] = [];
  heartBehavioural: BehaviorSubject<string[]> = new BehaviorSubject([]);
  
  constructor(
    private sgaLinkerService: SgaLinkerService,
    private authService: AuthService
  ) {
    this.getCommissionsSelectedData().subscribe((data: {[id: string]: SubjectCommissions}) => {
        //console.log("data of commissions selected updated: ");
        //console.log(data);
      }
    );
  }
  getMaterias(): Observable<Subject[]> {
    return this.subjectData.asObservable();
  }
  setSubjectData(data: Observable<Subject[]>) {
    
    data.subscribe((subjects: Subject[]) => {
      this.subjectData.next(subjects);
      this.subjects = subjects;

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
  setAlgorithmResults(results: Combination[]){
    // this line must be erased
    console.log(`Results set = ${results}`);
    // the last line must be erased

    this.algorithmResults = results;
  }
  getAlgorithmResults(): Combination[]{
    return this.algorithmResults;
  }
  removeSubject(subject: Subject) {
   delete this.subjectCommissions[subject.code];
   this.subjectCommissionsBehavioural.next(this.subjectCommissions);
  }
  // getCommissionsSelected(): SubjectCommissions[]{
  getCommissionsSelectedData(): Observable<{[id: string]: SubjectCommissions}> {
    return this.subjectCommissionsBehavioural.asObservable();
  }
  getSelectedData(): SubjectCommissions[] {
    var ans : SubjectCommissions[] = [];

    for (var item of this.subjects){
      ans.push({subject: item, commissions: this.subjectCommissions[item.code].commissions});
    }
    return ans;
  }
  // }

  changeHeartList(id : string, value: boolean){
    console.log(`El corazon ${id} cambio a ${value}`);
    if (value){
      if (this.hearts.length < 3){
        this.hearts.push(id);
      }
    }else{
      var index = this.hearts.indexOf(id);
      this.hearts.splice(index, 1);  
    }
    this.heartBehavioural.next(this.hearts);
    console.log(`this.hearts = ${this.hearts}`);
  }
  getHeartList(): Observable<string[]>{
    return this.heartBehavioural.asObservable();
  }
}
