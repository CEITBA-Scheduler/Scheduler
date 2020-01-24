import { DbServicesService } from './../db-services.service';
import { Component, OnInit } from '@angular/core';
import { parse, set, format } from 'date-fns';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject, Commission } from '../materia';

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
  userSelection: Observable <Subject[]>;
  userSelectionCommissions: Observable<{[code: string]: Observable<Commission[]>}>;
  userInitialConfigStatus: {[code: string]: Observable<boolean>};

  constructor(private dbServicesService: DbServicesService) {

  }

  ngOnInit() {
    this.userSelection = this.dbServicesService.getUserSubjectSelection();
    this.userSelectionCommissions = this.dbServicesService.getUserCommissionSelection();
    this.userInitialConfigStatus = this.dbServicesService.getUserInitialConfigStatus();
  }

  done() {
    this.onDone.emit(null);
  }
}
