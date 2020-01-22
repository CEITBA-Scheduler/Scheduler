import { Component, OnInit } from '@angular/core';
import { parse, set, format } from 'date-fns';
import { Output, EventEmitter } from '@angular/core';

/* Stepper control: handles the program highest level
structure to different algoritm stages */

/* There is no need of .ts code */

@Component({
  selector: 'app-stepper-control',
  templateUrl: './stepper-control.component.html',
  styleUrls: ['./stepper-control.component.css']
})
export class StepperControlComponent implements OnInit {
<<<<<<< HEAD

  @Output() onDone: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit() {

  }
=======
  @Output() onDone: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }
>>>>>>> 3b24848c4159fcbf2a11f19479c4c25ed6a8277f

  done() {
    this.onDone.emit(null);
  }
}
