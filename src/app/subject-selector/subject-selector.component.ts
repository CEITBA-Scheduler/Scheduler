//import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'
import { Subject } from '../materia';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.css']
})
export class SubjectSelectorComponent implements OnInit {
  plainData: Subject[] = [];
  dataSource = new BehaviorSubject<Subject[]>([]);
  constructor(private combinacionService: CombinacionDeHorarioService) { }

  ngOnInit() {
  }

  addMateria(materia: Subject){
    materia.priority = this.plainData.length + 1;
    this.plainData.push(materia);

    this.dataSource.next(this.plainData);

    //this.combinacionService.updateMaterias(this.dataSource.value);

    //console.log(this.data);
  }

  setData(data: Observable<Subject[]>) {
    this.combinacionService.setSubjectData(data);
  }
}
