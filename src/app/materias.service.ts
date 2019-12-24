import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError, map, tap } from 'rxjs/operators';

import { Materia } from './materia';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {
  private getMateriasUrl = 'api/materias';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  
  buscarMaterias(term : string) : Observable<Materia[]> {
    if (!term.trim()){
      return of([]);
    }
    return this.http.get<Materia[]>(`${this.getMateriasUrl}/?nombre=${term}`).pipe(
      tap(_ => this.log(`se encontrar materias con el termino "${term}"`)),
      catchError(this.handleError<Materia[]>('materias',[]))
    );
  }
  getMaterias(){
      return this.http.get<Materia[]>(this.getMateriasUrl);
  }
  private handleError<T>(operation = 'operation', result?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed ${error.message}`);
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`Servicio de materias ${message}`);
  }
}
  