import { Component, OnInit, Output } from '@angular/core';
import { Materia } from '../materia';
import { BehaviorSubject, Observable } from 'rxjs'
import { EventEmitter } from 'protractor';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'

const ELEMENT_DATA: Materia[] = [
];

@Component({
  selector: 'app-tabla-de-materias',
  templateUrl: './tabla-de-materias.component.html',
  styleUrls: ['./tabla-de-materias.component.css']
})
export class TablaDeMateriasComponent implements OnInit {
  displayedColumns: string[] = ['name', 'code'];
  data : Materia[] = [];
  dataSource = new BehaviorSubject<Materia[]>([]);

  constructor(private combinacionService : CombinacionDeHorarioService) { }

  ngOnInit() {
    
  }
  private addMateria(materia : Materia){
    console.log("agregando materia ");
    console.log(materia);
    this.data.push(
      {nombre: materia.nombre, codigo: materia.codigo, search: materia.search});
    
    this.dataSource.next(this.data);
    this.combinacionService.updateMaterias(this.dataSource.value);

    console.log(this.data);
  }
  private removeMateria(materia){
    console.log("Eliminando ...");
    console.log(materia);

    this.data.splice(this.data.findIndex((item : Materia) => item.codigo == materia.codigo),1);
    console.log(this.data);

    this.dataSource.next(this.data);
    this.combinacionService.updateMaterias(this.dataSource.value);
    
    console.log(this.dataSource);
  }
}
