import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, Comission } from '../materia';
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

  comissions: { [subject: string]: { [letter: string]: Comission; }};

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService, private sgaLinkerService : SgaLinkerService){
  }

  ngOnInit() {
    this.materias = this.combinacionDeHorarioService.getMaterias();
    this.materias.subscribe(materias =>{
      this.comissions = {};
      for (let materia of materias){
        this.comissions[materia.code] = this.sgaLinkerService.getComissions(materia);
      }
      console.log("Comisiones:");
      console.log(this.comissions);
    });
  }
}
