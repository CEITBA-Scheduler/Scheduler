//import { Observable } from 'rxjs';
import { Input, Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'
import { Subject } from '../materia';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { Commission } from '../algorithm/algorithm-object';


@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.css']
})
export class SubjectSelectorComponent implements OnInit {

  @Input() userSelection: Observable<Subject[]>;

  plainData: Subject[] = [];

  dataSource = new BehaviorSubject<Subject[]>([]);
  constructor(private combinacionService: CombinacionDeHorarioService) { }

  ngOnInit() {

    this.combinacionService.setSubjectData(this.dataSource.asObservable());
    if (this.userSelection) {
      this.userSelection.subscribe((data: Subject[]) => {
        this.plainData = data;
        this.dataSource.next(this.plainData);
      });
    }
  }

  addMateria(materia: Subject){
    materia.priority = this.plainData.length + 1;
    this.plainData.push(materia);

    this.dataSource.next(this.plainData);

    //this.combinacionService.updateMaterias(this.dataSource.value);

    //console.log(this.data);
  }

  removeSubjectData(materia){

    this.plainData.splice(this.plainData.findIndex((item : Subject) => item.code == materia.code),1);
    for (var i = 0;i < this.plainData.length;i++){
      this.plainData[i].priority = i + 1;
    }

    this.dataSource.next(this.plainData);
    //this.combinacionService.updateMaterias(this.dataSource.value);

  }

  setData(data: Observable<Subject[]>) {

  }

}
