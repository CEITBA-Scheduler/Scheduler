import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectCommissionConfigComponent } from '../subject-commission-config/subject-commission-config.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Subject, Commission, SubjectCommissions, generateSubjectCommissionsFromCombionation, generateSubjectCommissionsCopy } from '../materia';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { Combination } from '../algorithm/algorithm-object';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-adjust-menu',
  templateUrl: './adjust-menu.component.html',
  styleUrls: ['./adjust-menu.component.css']
})
export class AdjustMenuComponent implements OnInit {
  @ViewChild('subjectCommissionConfig', {static: false}) subjectCommissionConfig: SubjectCommissionConfigComponent;
  options: string[] = [
    '12',
    '13',
    '15'
  ];

  optionNames = [
    "Principal",
    "Plan B",
    "Plan C"
  ]
  algorithmResults: Combination[];
  selectedOption: Observable<number>;
  selectedBehavioural: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  dataSubject: {[code: string]: SubjectCommissions[]} = {};
  dataSubjectModified: {[code: string]: SubjectCommissions[]} = {};
  currentSelectedCode: string;

  subjects: Observable<SubjectCommissions[]>; // combinacion almacenada por la materia
  subjectsBehaviour: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject([]);
  selectedSubject: Subject;

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService) { }

  ngOnInit() {
    this.algorithmResults = this.combinacionDeHorarioService.getAlgorithmResults();

    this.selectedOption = this.selectedBehavioural.asObservable();
    this.subjects = this.subjectsBehaviour.asObservable();

    this.combinacionDeHorarioService.getHeartList().subscribe((options: string[]) => {
      this.options = options

      for (let option of this.options){
        this.dataSubject[option] = generateSubjectCommissionsFromCombionation(this.algorithmResults[+option-1]);
        this.dataSubjectModified[option] = generateSubjectCommissionsFromCombionation(this.algorithmResults[+option-1]);
      }
      //console.log(this.subjects);
      console.log(this.options);
      //this.selectOption(0);
    });
  

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
  }
  selectOption(selected: number){
    console.log(`selected ${selected}`)
    this.currentSelectedCode = this.options[+selected];
    this.selectedBehavioural.next(+selected);
    this.subjectsBehaviour.next(this.dataSubjectModified[this.options[+selected]]);
    
  }
  subjectChanged(commission: SubjectCommissions){
    console.log("Subject changed");
    console.log(commission);
    this.subjectCommissionConfig.setAvoidMyself();

    for (let i in this.dataSubjectModified[this.currentSelectedCode]){
      if (this.dataSubjectModified[this.currentSelectedCode][i].subject.code == commission.subject.code){
        // we found it
        this.dataSubjectModified[this.currentSelectedCode][i].commissions[0] = commission.commissions[0];    
        this.subjectsBehaviour.next(this.dataSubjectModified[this.currentSelectedCode]);
      
      }
    }
  }
  changeSelectedSubject(subject: Subject){
    this.selectedSubject = subject;
  }
  resetSubjects(){
    console.log("Reset subjects");
    for (let i in this.dataSubjectModified[this.currentSelectedCode]){
      this.dataSubjectModified[this.currentSelectedCode][i].commissions[0] = this.dataSubject[this.currentSelectedCode][i].commissions[0]; 
    }
    this.subjectsBehaviour.next(this.dataSubjectModified[this.currentSelectedCode]);

  }
}
