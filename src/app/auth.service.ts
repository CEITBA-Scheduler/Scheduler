import { Injectable } from '@angular/core';

/*** Este es el servicio que se encarga de autentificar al usuario ***/

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User, FirestoreCommissionSelection, TickboxSelection } from './user.model'; // optional
import { Subject } from './materia';

import { auth } from 'firebase/app';
//import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { SubjectCommissions, Commission } from './materia';
import { token } from './secrets';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {

  user?: User = null;
  notreg = false;
  behaviourUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  urlGetDni : string = "https://itbagw.itba.edu.ar/api/v1/people/"+token.CEITBA+"?email="; // email url
  urlGetPlan: string = "https://itbagw.itba.edu.ar/api/v1/students/"+token.CEITBA+"/"
  credentials?;
  dbSubjects: BehaviorSubject<Subject[]>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore,
    private http: HttpClient
) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.afAuth.authState.subscribe(user => {
      //console.log(user)
      if(user){
        //logged in
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          imageUrl: user.photoURL
        };
        console.log("user logged in");
        console.log(this.user);

        this.generateUserDb();

      }else{
        // Logged out
        this.user = null;
        this.behaviourUser.next(this.user); // avisamos al resto del programa que el login fue exitoso
      }
    });
  }
  getSgaInfo() : Observable<{[id: string] : string}>{
    const obs: BehaviorSubject<{[id: string] : string}> = new BehaviorSubject<{[id: string] : string}>({});

    // obtener primero dni y con el dni obtener el plan
    this.http.get(this.urlGetDni + this.user.email).subscribe(
      data => {

        this.http.get(this.urlGetPlan + data["dni"]).subscribe(
          data => {
            console.log(data);
            obs.next(
              {
                success: "true",
                plan: data["plan"],
                career: data["career"]
              }
            );
          }
        )
      },
      error => {
        obs.next(
          {
            success: "false"
          }
        )
      }
    );

    return obs.asObservable();
  }
  generateUserDb(){

    this.afs.collection("users").doc(this.user.uid).get().subscribe(data => {
      if (!data.exists){
        console.log("First user login")
        console.log("Generating user db ...");
        this.getSgaInfo().subscribe((udata: {[id: string] : string}) => {
          console.log("udata = ");
          console.log(udata);

          if (Object.keys(udata).length != 0){
            if (udata.success == "true"){
            // si no existe la db del usuario la creamos
              this.afs.collection("users").doc(this.user.uid).set({
                uid: this.user.uid,
                plan: udata.plan,
                career: udata.career
              });
              this.behaviourUser.next(this.user); // avisamos al resto del programa que el login fue exitoso
              this.notreg = false;
            }else{
              console.log("El mail no esta registrado en el itba");
              this.notreg = true;
            }
          }
        });


      }else{
        console.log("Welcome user " + this.user);
        console.log(data.data());

        if ("plan" in data.data()){
          this.user.plan = data.data()["plan"];
        }
        if ("career" in data.data()){
          this.user.career = data.data()["career"];
        }
        if ("tickboxSelection" in data.data()){
          this.user.tickboxSelection = data.data()["tickboxSelection"];
        }
        if ("userSelection" in data.data()){
          this.user.userSelection = data.data()["userSelection"];
        }

        this.behaviourUser.next(this.user); // avisamos al resto del programa que el login fue exitoso
      }
    });
  }



  /// actualizar en la información de usuario la información introducida en los formularios
  updateUserSelection(subjectCommissions: SubjectCommissions[], tickboxSelection: TickboxSelection) {
    this.user.userSelection = [];

    for (var item of subjectCommissions){
      var comList: string[] = [];

      for (var com of item.commissions){
        comList.push(com.name);
      }

      this.user.userSelection.push(
        {subjectCode: item.subject.code, subjectName: item.subject.name, commissions: comList}
      );
      this.user.tickboxSelection = tickboxSelection;
    }
  }
  getUserObservable(): Observable<User>{
    return this.behaviourUser.asObservable();
  }
  getUser(){
    return this.user;
  }

  getLogged(): boolean {
    return this.user != null;
  }

  getUserUid() : string{
    if (this.user == null){
      return "none";
    }else{
      return this.user.uid;
    }
  }
  getUserEmail(): string{
    if (this.user == null){
      return "none";
    }else{
      return this.user.email;
    }
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.getLogged()) {
      if (route.data.requireLogin) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    } else {
      if (route.data.requireLogin) {
        //this.router.navigate(['login']);
        return false;
      } else {
        return true;
      }
    }
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.notreg = false;
    //this.router.navigate(['/login']);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(
      result =>{
        this.credentials = result;
        //console.log("Success... Google account Linked!")

      }).catch(err=> {
          //console.log(err)
          console.log("Failed to login")
        }
      )

  }
}
