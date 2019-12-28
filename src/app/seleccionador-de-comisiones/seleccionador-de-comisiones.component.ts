import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Commission } from '../materia';
import { MateriasService } from '../materias.service';
import { SgaLinkerService } from '../sga-linker.service';

import { Observable, BehaviorSubject } from 'rxjs';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';

@Component({
  selector: 'app-seleccionador-de-comisiones',
  templateUrl: './seleccionador-de-comisiones.component.html',
  styleUrls: ['./seleccionador-de-comisiones.component.css']
})
export class SeleccionadorDeComisionesComponent implements OnInit {
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
