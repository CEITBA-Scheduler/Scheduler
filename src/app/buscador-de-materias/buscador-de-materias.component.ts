import { Component, OnInit, ValueProvider, EventEmitter, Output  } from '@angular/core';
import { Observable, Subject as SubjectRXJS } from 'rxjs';
import { pipe } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { debounceTime, multicast, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from '../materia';
import { MateriasService } from '../materias.service'
import { MatTableDataSource} from '@angular/material/table';
 
@Component({
  selector: 'app-buscador-de-materias',
  templateUrl: './buscador-de-materias.component.html',
  styleUrls: ['./buscador-de-materias.component.css']
})

export class BuscadorDeMateriasComponent implements OnInit {
  @Output() onOptionSelected : EventEmitter<Subject> = new EventEmitter<Subject>();

  options: Observable<Subject[]>;
  filteredOptions: Observable<Subject[]>;
  searchValue: string;
  myControl = new FormControl();
  displayedColumns: string[] = ['name', 'code'];
  

  constructor(private materiasService: MateriasService) { }

  ngOnInit() {
    
    this.options = this.materiasService.getMaterias();

    this.options.subscribe(
      (materias :Subject[]) => (console.log(materias) )
    );

    this.myControl.valueChanges.subscribe(
      val => this.updateWrittenValue(val)
    );
    this.filteredOptions = this.getFilteredValues();
  }
  private updateWrittenValue(value){
    this.searchValue = value.toLowerCase();
    this.filteredOptions = this.getFilteredValues();
  }
  private getFilteredValues(): Observable<Subject[]> {
    return this.options.pipe(
      map(
        (options : Subject[]) => options.filter((option: Subject) => option.search.includes(this.searchValue))
      )
    );
  }
  private optionSelected(value : Subject){
    console.log("Materia seleccionada", value);
    this.onOptionSelected.emit(value);

    this.myControl.setValue('');
  }
}
