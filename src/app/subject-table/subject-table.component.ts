import { Component, OnInit, Output } from '@angular/core';
import { Subject } from '../materia';
import { BehaviorSubject, Observable } from 'rxjs'
import { EventEmitter } from 'protractor';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'

/** Tabla de materias 
 * 
 * 
 * 
 * **/


const ELEMENT_DATA: Subject[] = [
];

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.css']
})
export class SubjectTableComponent implements OnInit {
  displayedColumns: string[] = ['priority', 'name', 'code'];
  data : Subject[] = [];
  dataSource = new BehaviorSubject<Subject[]>([]);

  constructor(private combinacionService : CombinacionDeHorarioService) { }

  ngOnInit() {
    
  }
  addMateria(materia : Subject){
    console.log("agregando materia ");
    console.log(materia);
    materia.priority = this.data.length+1;
    this.data.push(materia);

    
    this.dataSource.next(this.data);    

    this.combinacionService.updateMaterias(this.dataSource.value);

    console.log(this.data);
  }
  removeMateria(materia){
    console.log("Eliminando ...");
    console.log(materia);

    this.data.splice(this.data.findIndex((item : Subject) => item.code == materia.code),1);
    for (var i = 0;i < this.data.length;i++){
      this.data[i].priority = i + 1;
    }
    
    console.log(this.data);

    this.dataSource.next(this.data);
    this.combinacionService.updateMaterias(this.dataSource.value);
    
    console.log(this.dataSource);
  }
}
