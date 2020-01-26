import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectCommissions } from '../materia';

@Component({
  selector: 'app-subject-commission-config',
  templateUrl: './subject-commission-config.component.html',
  styleUrls: ['./subject-commission-config.component.css']
})
export class SubjectCommissionConfigComponent implements OnInit {
  @Input() subjectCommissionsData: Observable<SubjectCommissions[]>; // external output
  @Output() subjectChanged: EventEmitter<SubjectCommissions> = new EventEmitter(); // subject change event

  subjectCommissions: SubjectCommissions[]; // edited internally, emmited externally


  constructor() { }

  ngOnInit() {
    this.subjectCommissionsData.subscribe((data: SubjectCommissions[]) => {
      this.subjectCommissions = data;

    });
  }
  commissionChange(changeData: SubjectCommissions){
    this.subjectChanged.emit(changeData);
  }
}
