import { Component, OnInit } from '@angular/core';
import { parse, set, format } from 'date-fns';

/* Stepper control: handles the program highest level
structure to different algoritm stages */

/* There is no need of .ts code */

@Component({
  selector: 'app-stepper-control',
  templateUrl: './stepper-control.component.html',
  styleUrls: ['./stepper-control.component.css']
})
export class StepperControlComponent implements OnInit {
  // no ts code

  constructor() {
    var test : Date = parse("02:50", 'HH:mm', new Date());

    console.log(format(test, "HH:mm") );

  }

  ngOnInit() {

  }

}
