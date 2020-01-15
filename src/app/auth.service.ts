import { Injectable } from '@angular/core';

/*** Este es el servicio que se encarga de autentificar al usuario ***/

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User, FirestoreCommissionSelection } from './user.model'; // optional

import { auth } from 'firebase/app';
//import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { SubjectCommissions, Commission } from './materia';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {

  user?: User = null;
  behaviourUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  credentials?;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.afAuth.authState.subscribe(user => {
      //console.log(user)
      if(user){
        //logged in
        this.user = user;
        this.generateUserDb();

      }else{
        // Logged out
        this.user = null;
      }
      this.behaviourUser.next(this.user);
    })
  }
  generateUserDb(){
    console.log("Generating user db ...");
    this.afs.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      email: this.user.email,
      displayName: this.user.displayName
    });
  }
  updateUserSelection(subjectCommissions: SubjectCommissions[]){
    this.user.userSelection = [];

    for (var item of subjectCommissions){
      var comList: string[] = []; 

      for (var com of item.commissions){
        comList.push(com.name);
      }

      this.user.userSelection.push(
        {subjectCode: item.subject.code, subjectName: item.subject.name, commissions: comList}
      );
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
    //this.router.navigate(['/login']);
  }
  
  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(
      result =>{
        this.credentials = result;

        console.log("Success... Google account Linked!");
        
      
      }).catch(err=> {
          console.log(err)
          console.log("Failed to do")
        }
      )

  }
}
