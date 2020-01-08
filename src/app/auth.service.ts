import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from './user.model'; // optional

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements CanActivate {

  user?: User = null;
  credentials?;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.afAuth.authState.subscribe(user => {
      //console.log(user)
      if(user){
        //logged in
        this.user = user;
      }else{
        // Logged out
        this.user = null;
      }
    })
  }

  getLogged(): boolean {
    return this.user != null;
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
        this.router.navigate(['login']);
        return false;
      } else {
        return true;
      }
    }
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider).then(
      result =>{
        this.credentials = result;
        console.log(this.credentials)
        console.log(this.credentials["user"]["email"])
        //console.log("Success... Google account Linked!")
      }).catch(
        err=>{
          console.log(err)
          console.log("Failed to do")
        }
      )

  }
}
