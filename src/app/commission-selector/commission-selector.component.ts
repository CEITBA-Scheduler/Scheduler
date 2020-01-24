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
  subjects: Observable<Subject[]>;
  @Input() selectedCommissions: Observable<{[code: string]: Observable<Commission[]>}>;

  selectedCommissionsData: {[code: string]: BehaviorSubject<Commission[]>} = {};

  constructor(
    private combinacionDeHorarioService: CombinacionDeHorarioService) {
  }

  ngOnInit() {
    // consigo todas las materias seleccionadas del menu 1 (el seleccionador de materias)
    this.subjects = this.combinacionDeHorarioService.getMaterias();

    this.subjects.subscribe((subject: Subject[]) => {

    });

    this.selectedCommissions.subscribe((data: {[code: string]: Observable<Commission[]>} ) => {
      this.selectedCommissionsData = data;
    });

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
    if (!(subject.code in this.selectedCommissionsData)){
      this.selectedCommissionsData[subject.code] = new BehaviorSubject<Commission[]>([]);
    }
    return this.selectedCommissionsData[subject.code].asObservable();
  }
}
