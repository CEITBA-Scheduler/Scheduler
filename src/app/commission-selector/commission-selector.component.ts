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
  materias = new BehaviorSubject<Subject[]>([]);

  commissions: { [subject: string]: Commission[] };

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService, private sgaLinkerService : SgaLinkerService){
  }

  ngOnInit() {
    // consigo todas las materias seleccionadas del menu 1 (el seleccionador de materias)
    this.materias = this.combinacionDeHorarioService.getMaterias();
    this.materias.subscribe(materias =>{
      this.commissions = {};
      for (let materia of materias){
        this.commissions[materia.code] = this.sgaLinkerService.getCommissions(materia);
      }
      console.log("Comisiones:");
      console.log(this.commissions);
    });
  }
}
