import { Injectable } from '@angular/core';
import { Subject } from './materia';

/** This service get commissions from subjects */
@Injectable({
  providedIn: 'root'
})
export class ComisionesService {
  // https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
  subjects : { [id : string] : Subject; };

  constructor() { 
    
  }
  
  getComissionsFromDb(){
    // this code get comission from database
  }
  addComission(nombre : string, horarios : {}){
    
  }
  getComissions(subjectCode : string){ // get data from comission
    return this.subjects[subjectCode].commissions;
  }
}
