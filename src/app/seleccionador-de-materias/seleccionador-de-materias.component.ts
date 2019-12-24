import { Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'


@Component({
  selector: 'app-seleccionador-de-materias',
  templateUrl: './seleccionador-de-materias.component.html',
  styleUrls: ['./seleccionador-de-materias.component.css']
})
export class SeleccionadorDeMateriasComponent implements OnInit {
  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService) { }

  ngOnInit() {
  }

}
