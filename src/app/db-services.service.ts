import { Injectable } from '@angular/core';
import { User, FirestoreCommissionSelection } from './user.model';

import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { UserSelection } from './materia';
import { CombinacionDeHorarioService } from './combinacion-de-horario.service';
import { GeneralProgramService } from './general-program.service';
import { Subject } from './materia';

/// algunos tutoriales de firestore
/* https://www.techiediaries.com/angular-firestore-tutorial/*/

/* almacenar en la base de datos firestore la selección del usuario */
/* https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/ */


@Injectable({
  providedIn: 'root'
})
export class DbServicesService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private combinacionDeHorarioService: CombinacionDeHorarioService,
    private generalProgramService: GeneralProgramService){ // servicio de firestore (base de datos)) { }
  }

  storeUserPreAlgorithmSelection(){

    ///primero actualizamos informacion del usuario
    this.auth.updateUserSelection(
      this.combinacionDeHorarioService.getSelectedData(),
      this.generalProgramService.getAllCheckboxStatus()
    );

    // luego esos valores los publicamos en la base de datos

    //this.firestore.collection("users).set("userSelection", this.getUserObjectFromUserSelection(userSelection));
    console.log("Updating user db ...");
    const user: User = this.auth.getUser();

    var userSelectionData = [];

    for (let userSelectionItem of user.userSelection){
      userSelectionData.push(
        {subjectCode: userSelectionItem.subjectCode},
        {commissions: userSelectionItem.commissions}
      );
    }
    var tickboxData = {
      superposition: user.tickboxSelection.superposition,
      freeday: user.tickboxSelection.freeday,
      buildingChange: user.tickboxSelection.buildingChange,
      travelTime: user.tickboxSelection.travelTime
    }

    this.afs.collection("users").doc(user.uid).update(
      {
        userSelection: user.userSelection,
        tickboxSelection: tickboxData
      }
    );
 }
 subscribeToSubjectInfo(subjects: {[code: string]: Subject}){ // obtener los anotados en cada comision de la materia

  this.afs.collection("users").valueChanges().subscribe(data => {
    console.log(data);
  });

  this.afs.collection("users").valueChanges().subscribe(data => {
    console.log("data recibida");
    console.log(data);
    
    for (let key in subjects){
      for (var commission in subjects[key].commissions){
        subjects[key].commissions[commission].people = [0, 0, 0]; // reseteamos personas de cada comision
      }
    }
      //si es con get(), iria data.doc
    for (let docName in data){ // for each document
      var doc = data[docName]; // y aca .data()
      console.log("doc data");
      console.log(doc);
      for (let subject in doc["userSelection"]){
        var subjectCode: string = doc["userSelection"][subject].subjectCode;
        var subjectData = doc["userSelection"][subject];
        console.log("subject data");
        console.log(subjectData);

        if (subjectCode in subjects){

          for (let commission in subjects[subjectCode].commissions){
            console.log("analizando ");
            console.log(commission);

            if (subjects[subjectCode].commissions[commission].name == subjectData.commissions[0]){
              subjects[subjectCode].commissions[commission].people[0] ++;
            }
            if (subjects[subjectCode].commissions[commission].name == subjectData.commissions[1]){
              subjects[subjectCode].commissions[commission].people[1] ++;
            }
            if (subjects[subjectCode].commissions[commission].name == subjectData.commissions[2]){
              subjects[subjectCode].commissions[commission].people[2] ++;
            }

          }
        }
      }

    }
  });

 }
}