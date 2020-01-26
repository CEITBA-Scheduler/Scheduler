import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SubjectCommissions } from '../materia';

@Component({
  selector: 'app-subject-commission-config',
  templateUrl: './subject-commission-config.component.html',
  styleUrls: ['./subject-commission-config.component.css']
})
export class SubjectCommissionConfigComponent implements OnInit {
  @Input() subjectCommissionsInput: Observable<SubjectCommissions[]>;
  subjectCommissionsData: {[code:string]: Observable<SubjectCommissions>} = {}; // external output
  subjectCommissionsBehaviour:  {[code:string]: BehaviorSubject<SubjectCommissions>} = {}
  objectKeys = Object.keys;
  avoidMyself: boolean = false;

  @Output() subjectChanged: EventEmitter<SubjectCommissions> = new EventEmitter(); // subject change event

  subjectCommissions: SubjectCommissions[]; // edited internally, emmited externally


  constructor() { }

  ngOnInit() {
    this.subjectCommissionsInput.subscribe((data: SubjectCommissions[]) => {
      console.log(`avoid myself=${this.avoidMyself}`);
      
      if (!this.avoidMyself){
        console.log("update subject commissions");
        this.subjectCommissions = data;
        for (var i of data){
          if (!this.subjectCommissionsBehaviour[i.subject.name]){
            this.subjectCommissionsBehaviour[i.subject.name] = new BehaviorSubject(i);
            this.subjectCommissionsData[i.subject.name] = this.subjectCommissionsBehaviour[i.subject.name].asObservable();
          }else{
            this.subjectCommissionsBehaviour[i.subject.name].next(i);
          }
        }
      }else{
        this.avoidMyself = false;
      }
    });
  }
  public setAvoidMyself(){
    this.avoidMyself = true;
  }
  commissionChange(changeData: SubjectCommissions){
    console.log("commission change");
    console.log(changeData);
    this.subjectChanged.emit(changeData);
  }
}
