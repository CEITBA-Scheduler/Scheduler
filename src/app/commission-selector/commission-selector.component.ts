import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Commission } from '../materia';
import { MateriasService } from '../materias.service';
import { SgaLinkerService } from '../sga-linker.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';

@Component({
  selector: 'app-commission-selector',
  templateUrl: './commission-selector.component.html',
  styleUrls: ['./commission-selector.component.css']
})
export class CommissionSelectorComponent implements OnInit {

  // this information is to get the subjects from the other observable
  subjects: Observable<Subject[]>;
  // this information is to make the start values of the commission selector
  @Input() selectedCommissions: Observable<{[code: string]: Observable<Commission[]>}>; 

  selectedCommissionsData: {[code: string]: BehaviorSubject<Commission[]>} = {};

  constructor(
    private combinacionDeHorarioService: CombinacionDeHorarioService) {
  }

  ngOnInit() {
    // consigo todas las materias seleccionadas del menu 1 (el seleccionador de materias)
    this.subjects = this.combinacionDeHorarioService.getMaterias();

    if (this.selectedCommissions){
      this.selectedCommissions.subscribe((data: {[code: string]: Observable<Commission[]>} ) => {
        //this.selectedCommissionsData = data;

        // the next line must be erased
        //console.log("updating selected commissions");
        //console.log(data); // ok
        // the last line must be erased

        for (let code in data){
          if (!(code in this.selectedCommissionsData)){
            this.selectedCommissionsData[code] = new BehaviorSubject<Commission[]>([]);
          }

          data[code].subscribe((newCommissions: Commission[]) => {
            //console.log(newCommissions);
            this.selectedCommissionsData[code].next(newCommissions);
          });

        }
      });
    }

    //if (this.selectedCommissions) {
    // this.selectedCommissions.subscribe((data: {[code: string]: Observable<Commission[]>}) => {
   //     this.selectedCommissionsData = data;
   //   });
  //  }

  }

  setCommissionData(subject: Subject, commissions: Observable<Commission[]>) {
    this.combinacionDeHorarioService.setSubjectSelectedCommissions(subject, commissions);
  }

  removeCommissionData(subject: Subject) {
    this.combinacionDeHorarioService.removeSubject(subject);
  }
  getSelectedCommissions(subject: Subject): Observable<Commission[]> {
    if (!(subject.code in this.selectedCommissionsData )){
      this.selectedCommissionsData[subject.code] = new BehaviorSubject<Commission[]>([]);
    }
    return this.selectedCommissionsData[subject.code].asObservable();
  }
}
