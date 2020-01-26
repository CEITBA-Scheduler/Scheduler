import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { TickboxSelection } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class GeneralProgramService {
  checkboxStatus: { [name: string]: BehaviorSubject<boolean>} = {};
  allCheckboxStatus: TickboxSelection = {
    superposition: false,
    freeday: false,
    buildingChange: false,
    travelTime: false,
    filtByPlan: false
  };

  // diccionario, clave name, contenido es un BehaviorSubject<boolean> que es una clase contiene el estado del checkbox
  // y administra cuando hay cambios. Con el metodo asObservable se puede conseguir un observable asociado al checkbox
  
  constructor() { }

  createCheckbox(checkboxName: string){ // crear un nuevo checkbox
    if(!this.checkboxStatus[checkboxName]){
      this.checkboxStatus[checkboxName] = new BehaviorSubject<boolean>(false);
    }
    // inicializamos la clase con el valor de checkbox inicial falso
  }
  /** 
  createCheckboxTrue(checkboxName: string,initialStatus: boolean){ // crear un nuevo checkbox
    if (initialStatus){
      this.checkboxStatus[checkboxName] = new BehaviorSubject<boolean>(true);
    }
    else
      this.checkboxStatus[checkboxName] = new BehaviorSubject<boolean>(false);
    // inicializamos la clase con el valor de checkbox inicial true
  }
  **/
  // actualizar estado de un checkbox
  updateCheckbox(checkboxName: string, status: boolean){
    this.allCheckboxStatus[checkboxName] = status;
    //console.log("checkbox y status")
    //console.log(checkboxName)
    //console.log(status)
    this.checkboxStatus[checkboxName].next(status); // actualizamos el estado del BehaviorSubject<boolean> al valor status
    // esto le indica al observable asociado que cambio de valor!
  }
  // obtener el estado de un checkbox
  getCheckboxStatusAsObservable(name: string): Observable<boolean> {
    if(!this.checkboxStatus[name]){
      this.createCheckbox(name);
    }
    return this.checkboxStatus[name].asObservable();
    // esto se puede hacer con observables para que this.checkboxStatus no sea modificado desde observar
  }
  getAllCheckboxStatus() : TickboxSelection{
    return this.allCheckboxStatus;
  }
}
