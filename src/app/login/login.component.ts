import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user.model'; // optional
import { SgaLinkerService } from '../sga-linker.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private linker: SgaLinkerService) { }

  ngOnInit() {
    if (this.authService.getLogged()){
      //console.log("El usuario esta logeado...");
      this.router.navigate(["combinadorDeHorarios"]);
    }else{
      //console.log("El usuario no esta logeado");
    }

    this.authService.getUserObservable().subscribe((user : User) => {
      if (user != null){
        this.router.navigate(['/combinadorDeHorarios']);
      }
    });
  }

  iniciarSesion() {
    this.authService.notreg = false;
    this.authService.signInWithGoogle();
  }
}
