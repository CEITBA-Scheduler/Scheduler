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

  @Output() onDone: EventEmitter<void> = new EventEmitter<void>();

  constructor() {

  }

  ngOnInit() {

  }

  done() {
    this.onDone.emit(null);
  }
}
