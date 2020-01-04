import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subject } from '../materia';
import { BehaviorSubject, Observable } from 'rxjs';
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
  plainData: Subject[] = [];
  dataSource = new BehaviorSubject<Subject[]>([]);

  @Output() setData: EventEmitter<Observable<Subject[]>> = new EventEmitter<Observable<Subject[]>>();

  constructor() { }

  ngOnInit() {
    this.setData.emit(this.dataSource.asObservable());
  }
  addMateria(materia: Subject){
    materia.priority = this.plainData.length + 1;
    this.plainData.push(materia);

    this.dataSource.next(this.plainData);

    //this.combinacionService.updateMaterias(this.dataSource.value);

    //console.log(this.data);
  }
  removeMateria(materia){

    this.plainData.splice(this.plainData.findIndex((item : Subject) => item.code == materia.code),1);
    for (var i = 0;i < this.plainData.length;i++){
      this.plainData[i].priority = i + 1;
    }

    this.dataSource.next(this.plainData);
    //this.combinacionService.updateMaterias(this.dataSource.value);

  }
}
