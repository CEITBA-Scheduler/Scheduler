import { Component, OnInit, Output } from '@angular/core';
import { Subject } from '../materia';
import { BehaviorSubject, Observable } from 'rxjs'
import { EventEmitter } from 'protractor';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'

/** Subject-table
 *
 *  Input: dataSource
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
  plainData : Subject[] = [];
  dataSource = new BehaviorSubject<Subject[]>([]);

  @output() setData: EventEmitter<Subject>;

  constructor() { }

  ngOnInit() {
    this.setData.emit(dataSource.asObservable());
  }
  addMateria(materia : Subject){
    materia.priority = this.data.length+1;
    this.plainData.push(materia);

    this.dataSource.next(this.plainData);

    this.combinacionService.updateMaterias(this.dataSource.value);

    console.log(this.data);
  }
  removeMateria(materia){

    this.data.splice(this.plainData.findIndex((item : Subject) => item.code == materia.code),1);
    for (var i = 0;i < this.plainData.length;i++){
      this.plainData[i].priority = i + 1;
    }

    this.dataSource.next(this.plainData);
    this.combinacionService.updateMaterias(this.dataSource.value);

  }
}
