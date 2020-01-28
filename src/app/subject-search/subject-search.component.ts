/**
 * Subject search
 * Este componente se encarga de administrar la busqueda de materias
 * obtenidas desde la base de datos. Tiene tanto la interfaz gráfica
 * como la lógica para el buscador
 */


import { Component, OnInit, ValueProvider, EventEmitter, Input, Output  } from '@angular/core';
import { Observable, BehaviorSubject, Subject as SubjectRXJS } from 'rxjs';
import { pipe } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { debounceTime, multicast, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from '../materia';;
import { MateriasService } from '../materias.service'
import { MatTableDataSource} from '@angular/material/table';
import { SgaLinkerService } from '../sga-linker.service';
import { GeneralProgramService } from '../general-program.service'
import { CareerTerm } from '../career-object';
import { ICareerSubject } from '../career-interface';
import { from , of} from 'rxjs'


@Component({
  selector: 'app-subject-search',
  templateUrl: './subject-search.component.html',
  styleUrls: ['./subject-search.component.css']
})

export class SubjectSearchComponent implements OnInit {
  @Input() subjects: Subject[] = [];
  @Input() initialStatus: {[code: string]: Observable<boolean>} = {};
  @Output() onOptionSelected : EventEmitter<Subject> = new EventEmitter<Subject>();

  options: Observable<Subject[]>;
  filteredOptions: Observable<Subject[]>;
  searchValue = '';
  myControl = new FormControl();
  displayedColumns: string[] = ['name', 'code'];
  optionsPosta: Observable<Subject[]> ;
  optionBehavior: BehaviorSubject<Subject[]> = new BehaviorSubject([]);

  sus1: any = null;
  sus2: any = null;

  filterByPlan = false;
  filtByPlanName = 'filtByPlan';
  filtPlanObs: Observable<boolean>;

  planSubjects: Subject[] = [];
  auxSubj: Subject = null;

  constructor(
    private sgaLinkerService: SgaLinkerService,
    private generalProgramService: GeneralProgramService) { }

  ngOnInit() {
    this.options = this.sgaLinkerService.getAllSubjectsAsList();

    this.myControl.valueChanges.subscribe(
      val => {
        this.updateWrittenValue(val);
      }
    );
    this.filteredOptions = this.getFilteredValues();

    this.sgaLinkerService.getCareerPlan().subscribe(data => {
      for (let careerCycle of data.cycles) {
        for (let term of careerCycle.terms) {
          for (let careerSubj of term.subjects) {
            this.auxSubj = {
              name: careerSubj.subjectName,
              code : careerSubj.subjectCode,
              search : this.removeTildes((careerSubj.subjectName + careerSubj.subjectCode).toLowerCase()), // si hay un bug es esto
              commissions : null, // Commission[]
              priority : 0, // number
              credits: careerSubj.credits
            };
            if (!this.planSubjects.find(subject => subject.code === this.auxSubj.code)) {
              this.planSubjects.push(
                this.auxSubj
              );
            }
          }
        }
      }
    });

    this.generalProgramService.getCheckboxStatusAsObservable("filtByPlan").subscribe( toggleStatus => {
      this.filterByPlan = toggleStatus;
      if (!toggleStatus) {
        this.optionsPosta = of(this.planSubjects);
        this.options.subscribe(data => {
          this.sus1 = this.optionBehavior.next(data);
        });
      } else {
        this.optionBehavior.next(this.planSubjects);
        if (this.sus1) {
          this.sus1.unsubscribe();
        }
      }
    });
  }

  removeTildes(word: string) {
    return word.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u");
  }

  private updateWrittenValue(value) {
    this.searchValue = value.toLowerCase();
    this.filteredOptions = this.getFilteredValues();
  }

  private getFilteredValues(): Observable<Subject[]> {
    return this.optionBehavior.asObservable().pipe(
      map(
      (options: Subject[]) => options.filter((option: Subject) =>
      (option.search.includes(this.removeTildes(this.searchValue)) && !(this.areEqual(option, this.subjects)))))
      );
  }

  optionSelected(value: Subject) {
    this.onOptionSelected.emit(value);
    this.myControl.setValue('');
  }

  private areEqual(subject_: Subject, subjects_: Subject[]) {
    for (let i = 0 ; i < subjects_.length ; i++) {
      if (subject_.code === subjects_[i].code) {
        return true;
      }
    }
    return false;
  }
}
