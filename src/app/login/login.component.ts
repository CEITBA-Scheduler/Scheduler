import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.authService.getLogged()){
      console.log("El usuario esta logeado...");
      this.router.navigate(["combinadorDeHorarios"]);
    }else{
      console.log("El usuario no esta logeado");
    }
  }

  iniciarSesion() {
    this.authService.signInWithGoogle();
  }
}
