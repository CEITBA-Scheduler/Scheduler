import { Component, OnInit } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DbServicesService } from '../db-services.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {
  formGroup: FormGroup;
  inputVal : string = "";

  constructor(private router: Router, private dbServices: DbServicesService) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      feedbackField: new FormControl('', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(3000)
      ])
    })
  }
  done(){
    this.router.navigate(["/combinadorDeHorarios"])
  }
  getErrorMessage(control: AbstractControl): string {
    // Don't say anything if control doesn't exist, or is valid
    if (!control || control.valid) {
      return '';
    }

    // Required always comes first
    if (control.hasError('required')) {
      return "No puede estar vacío";
    }
    if (control.hasError('email')) {
      return "Debe ser un e-mail valido";
    }
    if (control.hasError('minlength')) {
      const limit = control.getError('minlength').requiredLength;
      return `Debe tener por lo menos ${limit} caracteres`;
    }
    if (control.hasError('minlength')) {
      const limit = control.getError('maxlength').requiredLength;
      return `No debe tener más de ${limit} caracteres`;
    }

    // Default general error message
    return "Entrada inválida";
  }

  onSubmit() {
    console.log("mando")
    console.log(this.inputVal)
    this.dbServices.updateUserComment(this.inputVal)
    this.formGroup.reset()
  }

  get emailField(): AbstractControl {
    return this.formGroup.get('emailField');
  }

  get feedbackField(): AbstractControl {
    return this.formGroup.get('feedbackField');
  }

}
