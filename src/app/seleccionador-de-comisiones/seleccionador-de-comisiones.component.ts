import { Component, OnInit } from '@angular/core';
import { Subject } from '../materia';
import { MateriasService } from '../materias.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';

@Component({
  selector: 'app-seleccionador-de-comisiones',
  templateUrl: './seleccionador-de-comisiones.component.html',
  styleUrls: ['./seleccionador-de-comisiones.component.css']
})
export class SeleccionadorDeComisionesComponent implements OnInit {
  materias = new BehaviorSubject<Subject[]>([]);

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService) {
  }

  ngOnInit() {
    this.materias = this.combinacionDeHorarioService.getMaterias();
  }
  
}
