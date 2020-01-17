/**
 * Subject search
 * Este componente se encarga de administrar la busqueda de materias
 * obtenidas desde la base de datos. Tiene tanto la interfaz gráfica 
 * como la lógica para el buscador
 */


import { Component, OnInit, ValueProvider, EventEmitter, Output  } from '@angular/core';
import { Observable, BehaviorSubject, Subject as SubjectRXJS } from 'rxjs';
import { pipe } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { debounceTime, multicast, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from '../materia';
import { MateriasService } from '../materias.service'
import { MatTableDataSource} from '@angular/material/table';
import { SgaLinkerService } from '../sga-linker.service';
 
@Component({
  selector: 'app-buscador-de-materias',
  templateUrl: './buscador-de-materias.component.html',
  styleUrls: ['./buscador-de-materias.component.css']
})

export class BuscadorDeMateriasComponent implements OnInit {
  // onOptionSelected es la acción a ejecutarse cuando se elije una opción
  @Output() onOptionSelected : EventEmitter<Subject> = new EventEmitter<Subject>();

  options: Observable<Subject[]>;
  filteredOptions: Observable<Subject[]>;
  searchValue: string;
  myControl = new FormControl();
  displayedColumns: string[] = ['name', 'code'];
  
  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
  
    this.options = this.sgaLinkerService.getAllSubjectsAsList();

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
    /// filtramos acorde al input del usuario el observable
    return this.options.pipe(
      map(
        (options : Subject[]) => options.filter((option: Subject) => option.search.includes(this.searchValue))
      )
    );
  }
  optionSelected(value : Subject){
    console.log("Materia seleccionada", value);
    this.onOptionSelected.emit(value);

    this.myControl.setValue('');
  }
}
