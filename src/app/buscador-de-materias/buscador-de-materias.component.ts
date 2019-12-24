import { Component, OnInit, ValueProvider, EventEmitter, Output  } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { pipe } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import {FormsModule, ReactiveFormsModule, FormControl} from '@angular/forms';
import { debounceTime, multicast, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Materia } from '../materia';
import { MateriasService } from '../materias.service'
import { MatTableDataSource} from '@angular/material/table';
 
@Component({
  selector: 'app-buscador-de-materias',
  templateUrl: './buscador-de-materias.component.html',
  styleUrls: ['./buscador-de-materias.component.css']
})

export class BuscadorDeMateriasComponent implements OnInit {
  @Output() onOptionSelected : EventEmitter<Materia> = new EventEmitter<Materia>();

  options: Observable<Materia[]>;
  filteredOptions: Observable<Materia[]>;
  searchValue: string;
  myControl = new FormControl();
  displayedColumns: string[] = ['name', 'code'];
  

  constructor(private materiasService: MateriasService) { }

  ngOnInit() {
    
    this.options = this.materiasService.getMaterias();

    this.options.subscribe(
      (materias :Materia[]) => (console.log(materias) )
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
  private getFilteredValues(): Observable<Materia[]> {
    return this.options.pipe(
      map(
        (options : Materia[]) => options.filter((option: Materia) => option.search.includes(this.searchValue))
      )
    );
  }
  private optionSelected(value : Materia){
    console.log("Materia seleccionada", value);
    this.onOptionSelected.emit(value);

    this.myControl.setValue('');
  }
}
