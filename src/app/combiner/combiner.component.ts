import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { DbServicesService } from '../db-services.service';

@Component({
  selector: 'app-combiner',
  templateUrl: './combiner.component.html',
  styleUrls: ['./combiner.component.css']
})
export class CombinerComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private dbServices: DbServicesService) { }

  ngOnInit() {
    this.authService.getUserObservable().subscribe((user : User) => {
      if (user != null){
        this.router.navigate(['/combinadorDeHorarios']);
        console.log("User is logged");
      }else{
        this.router.navigate(['/login']);
        console.log("User is not logged");
      }
    });
  }

  logOut(){
    this.authService.signOut();
  }

  runCombiner(){
    this.dbServices.storeUserPreAlgorithmSelection();
  }
}
