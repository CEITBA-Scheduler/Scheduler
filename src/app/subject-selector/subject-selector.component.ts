import { Input, Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service'
import { Subject } from '../materia';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { Commission } from '../algorithm/algorithm-object';
import { SgaLinkerService } from '../sga-linker.service';


@Component({
  selector: 'app-subject-selector',
  templateUrl: './subject-selector.component.html',
  styleUrls: ['./subject-selector.component.css']
})
export class SubjectSelectorComponent implements OnInit {

  @Input() userSelection: Observable<Subject[]>;

  plainData: Subject[] = [];

  dataSource = new BehaviorSubject<Subject[]>([]);
  constructor(
    private combinacionService: CombinacionDeHorarioService,
    private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
    this.combinacionService.setSubjectData(this.dataSource.asObservable());

    // Bug fixing, adding empty fields
    this.sgaLinkerService.getCareerPlan()
    .subscribe(
      careerPlan => {
        if (this.userSelection) {
          this.userSelection.subscribe((data: Subject[]) => {
            for (const cycle of careerPlan.cycles) {
              for (const term of cycle.terms) {
                for (const subject of term.subjects) {
                  const foundSubject = data.find(subj => subj.code === subject.subjectCode);
                  if (foundSubject) {
                    foundSubject.credits = subject.credits;
                  }
                }
              }
            }
            this.plainData = data;
            this.dataSource.next(this.plainData);
          });
        }
      }
    );
  }

  addMateria(materia: Subject) {
    materia.priority = this.plainData.length + 1;
    this.plainData.push(materia);
    this.dataSource.next(this.plainData);
  }

  removeSubjectData(materia) {
    this.plainData.splice(this.plainData.findIndex((item: Subject) => item.code === materia.code), 1);
    for (let i = 0 ; i < this.plainData.length ; i++) {
      this.plainData[i].priority = i + 1;
    }
    this.dataSource.next(this.plainData);
  }

  setData(data: Observable<Subject[]>) { }
}
