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

  constructor(
    private combinacionDeHorarioService: CombinacionDeHorarioService) {
  }

  ngOnInit() {
    // consigo todas las materias seleccionadas del menu 1 (el seleccionador de materias)
    this.subjects = this.combinacionDeHorarioService.getMaterias();
  }

  setCommissionData(subject: Subject, commissions: Observable<Commission[]>) {
    this.combinacionDeHorarioService.setSubjectSelectedCommissions(subject, commissions);
  }

  removeCommissionData(subject: Subject) {
    this.combinacionDeHorarioService.removeSubject(subject);
  }
}
