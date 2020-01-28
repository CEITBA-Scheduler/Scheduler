import { SgaLinkerService } from './sga-linker.service';
import { Observable, BehaviorSubject, pipe } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { User, FirestoreCommissionSelection } from './user.model';

import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from './auth.service';
import { UserSelection, SubjectCommissions } from './materia';
import { CombinacionDeHorarioService } from './combinacion-de-horario.service';
import { GeneralProgramService } from './general-program.service';
import { Subject, Commission } from './materia';

/// algunos tutoriales de firestore
/* https://www.techiediaries.com/angular-firestore-tutorial/*/

/* almacenar en la base de datos firestore la selección del usuario */
/* https://angularfirebase.com/lessons/firestore-advanced-usage-angularfire/ */


@Injectable({
  providedIn: 'root'
})
export class DbServicesService {
  dbSubjects: BehaviorSubject<Subject[]> = new BehaviorSubject([]);
  dbSubjectsCommissions: BehaviorSubject<{[code: string]: Observable<Commission[]>}> = new BehaviorSubject({});
  dbConfigCheckbox: {[code: string]: BehaviorSubject<boolean>} = {
    superposition: new BehaviorSubject<boolean>(false),
    freeday: new BehaviorSubject<boolean>(false),
    buildingChange: new BehaviorSubject<boolean>(false),
    travelTime: new BehaviorSubject<boolean>(false)
  };

  subjectsData: { [id: string]: Subject };
  selectedSubjectsInfo: string[] = [];

  // got subject info from sga
  gotSubjectInfo: boolean;

  // go subject info from user data
  gotUserSubjectInfo: boolean;

  // to store subject codes loaded from db
  subjectCodes: string[] = [];

  // to store commission names loaded from db
  commissionNames: {[subjectCode: string]: string[]} = {};


  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private combinacionDeHorarioService: CombinacionDeHorarioService,
    private generalProgramService: GeneralProgramService,
    private sgaLinkerService: SgaLinkerService) { // servicio de firestore (base de datos)) { }
    this.gotSubjectInfo = false;

    this.sgaLinkerService.getAllSubjects().subscribe((data: { [id: string]: Subject }) => {
      this.gotSubjectInfo = true;
      this.subjectsData = data;
      if (this.gotUserSubjectInfo) {
        this.updateUserSubjectSelection();
      }

    });
  }

  storeUserPreAlgorithmSelection(){

    // primero actualizamos informacion del usuario
    this.auth.updateUserSelection(
      this.combinacionDeHorarioService.getSelectedData(),
      this.generalProgramService.getAllCheckboxStatus()
    );

    // luego esos valores los publicamos en la base de datos

    // this.firestore.collection("users).set("userSelection", this.getUserObjectFromUserSelection(userSelection));
    // console.log("Updating user db ...");
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
    /*this.afs.collection("users").valueChanges().subscribe(data => {
      //console.log(data);
    });*/

    this.afs.collection('users').valueChanges().subscribe(data => {

      for (const key in subjects) {
        for (const commission in subjects[key].commissions){
          subjects[key].commissions[commission].people = [0, 0, 0]; // reseteamos personas de cada comision
        }
      }
        // si es con get(), iria data.doc
      for (const docName in data){ // for each document
        var doc = data[docName]; // y aca .data()

        for (const subject in doc["userSelection"]) {
          var subjectCode: string = doc["userSelection"][subject].subjectCode;
          var subjectData = doc["userSelection"][subject];


          if (subjectCode in subjects){

            for (let commission in subjects[subjectCode].commissions){

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

  askForUserSubjectSelection() {
    const user: User = this.auth.getUser();
    this.subjectCodes = [];
    if (user.userSelection){
      for (let matI of user.userSelection){
        this.subjectCodes.push(matI.subjectCode);
        this.commissionNames[matI.subjectCode] = matI.commissions;
        // the next line must be erased
        // console.log("commissions:");
        // console.log(matI.commissions);
        // the last line must be erased
      }
    }
    if (user.tickboxSelection){
      this.dbConfigCheckbox["superposition"].next(user.tickboxSelection.superposition);
      this.dbConfigCheckbox["freeday"].next(user.tickboxSelection.freeday);
      this.dbConfigCheckbox["buildingChange"].next(user.tickboxSelection.buildingChange);
      this.dbConfigCheckbox["travelTime"] .next(user.tickboxSelection.travelTime);
    }
    this.gotUserSubjectInfo = true;

    if (this.gotSubjectInfo) {
      this.updateUserSubjectSelection();
    }

  }
  // get user last subject selection
  getUserSubjectSelection(): Observable<Subject[]> {
    return this.dbSubjects.asObservable();
  }

  // get user last commissions selection
  getUserCommissionSelection(): Observable<{[code: string]: Observable<Commission[]>}>{
    return this.dbSubjectsCommissions.asObservable();
  }

  getUserInitialConfigStatus(): {[code: string]: Observable<boolean>} {
    var ans : {[code: string]: Observable<boolean>} = {};

    for (let i in this.dbConfigCheckbox){
      ans[i] = this.dbConfigCheckbox[i].asObservable();
    }

    return this.dbConfigCheckbox;
  }

  /** to call this function two queries must be have been asnwered,
   * the subjectData query and the userData for selected subjects
   * **/

  updateUserSubjectSelection(){
    var subjects: Subject[] = [];
    var subjectsCommissions: {[code: string]: Observable<Commission[]>} = {};

    for (let subjectCode of this.subjectCodes) {
      subjects.push(this.subjectsData[subjectCode]);
      var commissions: Commission[] = [];

      for (let commission of this.subjectsData[subjectCode].commissions){
        if (this.commissionNames[subjectCode].includes(commission.name)){
          commissions.push(commission);
        }
      }
      subjectsCommissions[subjectCode] = new BehaviorSubject(commissions).asObservable();
    }

    /*"superposition": new BehaviorSubject<boolean>(false),
    "freeday": new BehaviorSubject<boolean>(false),
    "buildingChange": new BehaviorSubject<boolean>(false),
    "travelTime": new BehaviorSubject<boolean>(false)*/
    this.dbSubjects.next(subjects);
    this.dbSubjectsCommissions.next(subjectsCommissions);
  }
  generateOption(combination: SubjectCommissions[]){
    if (combination){

      var userSelection = [];
      for (var subjectSelection of combination){
        userSelection.push(
          {
            subjectCode: subjectSelection.subject.code,
            subjectName: subjectSelection.subject.name,
            commission: subjectSelection.commissions[0].name
          }
        );
      }
      var exists;
      if (userSelection.length > 0){
        exists = true;
      }else{
        exists = false;
      }
      return {
        exists: exists,
        userSelection: userSelection
      }
    }else{
      return {
        exists: false
      }
    }
  }
  updateUserSelection1(combination1: SubjectCommissions[]){
    const user: User = this.auth.getUser();
    var option = this.generateOption(combination1);
    this.afs.collection("usersSelection").doc(user.uid).set(
      {
        options: {
          userFirstOption: option
        }
      }, {merge: true}
    );
  }
  updateUserSelection2(combination2: SubjectCommissions[]){
    const user: User = this.auth.getUser();
    var option = this.generateOption(combination2);
    this.afs.collection("usersSelection").doc(user.uid).set(
      {
        options: {
          userSecondOption: option
        }
      }, {merge: true}
    );
  }
  updateUserSelection3(combination3: SubjectCommissions[]){
    const user: User = this.auth.getUser();
    var option = this.generateOption(combination3);
    this.afs.collection("usersSelection").doc(user.uid).set(
      {
        options: {
          userThirdOption: option
        }
      }, {merge: true}
    );
  }

  updateUserSelections(combination1: SubjectCommissions[], combionation2: SubjectCommissions[], combinacion3: SubjectCommissions[]){ // store in order user selection in db
    console.log("updating data");

    const user: User = this.auth.getUser();

    var firstOption = this.generateOption(combination1);
    var secondOption = this.generateOption(combionation2);
    var thirdOption = this.generateOption(combinacion3);
    console.log({
        options: {
          userFirstOption: firstOption,
          userSecondOption: secondOption,
          userThirdOption: thirdOption
        }
      });

    this.afs.collection("usersSelection").doc(user.uid).set(
      {
        options: {
          userFirstOption: firstOption,
          userSecondOption: secondOption,
          userThirdOption: thirdOption
        }
      }
    );
  }
  updateUserComment(comment: string){
    const user: User = this.auth.getUser();

    this.afs.collection("users").doc(user.uid).update(
      {
        comment: comment
      }
    )
  }
  getSubjectCommissionsPeople(subject: Subject) : Observable<{[code: string] : number}>{
    return this.afs.collection("subjectAnalytics").doc(subject.code).valueChanges().pipe(
      map(doc => this.convertToCastedDict(subject, doc))
    )
  }
  convertToCastedDict(subject: Subject, doc: any) : {[code: string] : number} {
    if (doc != undefined){
      var ans: {[code: string] : number} = {};
      for (let commission of subject.commissions){
        if (`${commission.name}` in doc){
          ans[commission.name] = doc[`${commission.name}`];
        }else{
          ans[commission.name] = 0;
        }
      }
      return ans;
    }else{
      var ans: {[code: string] : number} = {};
      for (let commission of subject.commissions){
        ans[commission.name] = 0;
      }
      return ans;
    }
  }

}
