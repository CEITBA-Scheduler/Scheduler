import { Injectable } from '@angular/core';
import { User, FirestoreCommissionSelection } from './user.model';

import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { UserSelection } from './materia';
import { CombinacionDeHorarioService } from './combinacion-de-horario.service';

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
    private combinacionDeHorarioService: CombinacionDeHorarioService){ // servicio de firestore (base de datos)) { }
  }
  
  storeUserPreAlgorithmSelection(){

    ///primero actualizamos informacion del usuario
    this.auth.updateUserSelection(this.combinacionDeHorarioService.getSelectedData());
    
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

    this.afs.collection("users").doc(user.uid).update(
      {userSelection: user.userSelection}
    );
 }
}
