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
import { Subject } from '../materia';
import { MateriasService } from '../materias.service'
import { MatTableDataSource} from '@angular/material/table';
import { SgaLinkerService } from '../sga-linker.service';
import { GeneralProgramService } from '../general-program.service'


@Component({
  selector: 'app-subject-search',
  templateUrl: './subject-search.component.html',
  styleUrls: ['./subject-search.component.css']
})

export class SubjectSearchComponent implements OnInit {
  // onOptionSelected es la acción a ejecutarse cuando se elije una opción
  //@Input() subjectsSelected:Subject[]; //AGREGO1
  @Input() subjects:Subject[] = []; //AGREGO1
  @Input() initialStatus: {[code: string]: Observable<boolean>} = {};
  @Output() onOptionSelected : EventEmitter<Subject> = new EventEmitter<Subject>();

  options: Observable<Subject[]>;
  filteredOptions: Observable<Subject[]>;
  searchValue: string = "";
  myControl = new FormControl();
  displayedColumns: string[] = ['name', 'code'];


  filterByPlan = false;
  plan = null;
  filtByPlanName : string = "filtByPlan";
  filtPlanObs : Observable<boolean>;

  constructor(private sgaLinkerService: SgaLinkerService, private generalProgramService : GeneralProgramService) { }

  ngOnInit() {
    this.options = this.sgaLinkerService.getAllSubjectsAsList();
  
    this.myControl.valueChanges.subscribe(
      val => this.updateWrittenValue(val)
    );
    this.filteredOptions = this.getFilteredValues();
    /* 
    this.sgaLinkerService.getCareerPlan().subscribe(data => {
      this.plan = data
    });
    */
    this.generalProgramService.getCheckboxStatusAsObservable("filtByPlan").subscribe( toggleStatus => {
      this.filterByPlan = toggleStatus; 
      // cada vez que cmabia esto cambia el options!!! es lo mas facil
    })

  }
  removeTildes(word: string){
    return word.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u");
  }
  private updateWrittenValue(value){
    this.searchValue = value.toLowerCase();
    this.filteredOptions = this.getFilteredValues();
  }
  private getFilteredValues(): Observable<Subject[]> {
    console.log("entre a get filtered values")
    /// filtramos acorde al input del usuario el observable
    return this.options.pipe(
      map(
        (options: Subject[]) => options.filter((option: Subject) =>
        (option.search.includes(this.removeTildes(this.searchValue)) && !(this.areEqual(option,this.subjects)))))
    );
  }
  optionSelected(value: Subject) {
    this.onOptionSelected.emit(value);

    this.myControl.setValue('');
  }

  private areEqual(subject_: Subject, subjects_: Subject[]){
    for(var i=0; i<subjects_.length ;i++){
      if(subject_.code == subjects_[i].code)
      {
        return true;
      }
    }
    return false;
  }

}
