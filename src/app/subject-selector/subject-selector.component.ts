import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'
import { Subject } from '../materia';

@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.css']
})
export class SubjectSelectorComponent implements OnInit {
  constructor(private combinacionService: CombinacionDeHorarioService) { }

  ngOnInit() {
  }
  setData(data: Observable<Subject[]>) {
    this.combinacionService.setSubjectData(data);
  }
}
