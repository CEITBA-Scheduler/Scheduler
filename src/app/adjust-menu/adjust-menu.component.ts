import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectCommissionConfigComponent } from '../subject-commission-config/subject-commission-config.component';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Subject, Commission, SubjectCommissions, generateSubjectCommissionsFromCombionation, generateSubjectCommissionsCopy } from '../materia';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { Combination } from '../algorithm/algorithm-object';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { DbServicesService } from '../db-services.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  selectedOptionNumber: number;

  selectedBehavioural: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  dataSubject: {[code: string]: SubjectCommissions[]} = {};
  dataSubjectModified: {[code: string]: SubjectCommissions[]} = {};
  currentSelectedCode: string;

  subjects: Observable<SubjectCommissions[]>; // combinacion almacenada por la materia
  subjectsBehaviour: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject([]);
  selectedSubject: Subject;
  updateObs: Observable<any>;
  updateSub: BehaviorSubject<any> = new BehaviorSubject(0);
  selectOptionSubj: BehaviorSubject<any> = new BehaviorSubject({last: -1, next: -1});

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService, private dbServices: DbServicesService) { }

  ngOnInit() {
    this.algorithmResults = this.combinacionDeHorarioService.getAlgorithmResults();

    this.selectedOption = this.selectedBehavioural.asObservable();
    this.selectedOption.subscribe((value: number) =>{
      this.selectedOptionNumber = value;
    })

    this.subjects = this.subjectsBehaviour.asObservable();
    
    this.combinacionDeHorarioService.getHeartList().subscribe((options: string[]) => {
      console.log("update heart list");
      this.options = options;

      for (let option of this.options){
        this.dataSubject[option] = generateSubjectCommissionsFromCombionation(this.algorithmResults[+option-1]);
        this.dataSubjectModified[option] = generateSubjectCommissionsFromCombionation(this.algorithmResults[+option-1]);
      }
      //console.log(this.subjects);
      //console.log(this.options);
      //this.selectOption(0); causa erroes esta linea
      //this.subjectsBehaviour.next(this.dataSubjectModified[this.options[0]]);
      //this.selec(0);
     // this.selectOption(1);
      //this.selectOption(2);
      //console.log("option = ")
      //console.log(this.dataSubjectModified[this.options[0]]);
      if (this.options.length == 1){
        this.selectOption(0);
      }else if (this.options.length == 2){
        this.selectOption(1);
      }else if (this.options.length == 3){
        this.selectOption(2);
      }
      
      let i = 0;
      for (var opt of this.options){
        if (i == 0){
          this.combinacionDeHorarioService.setCombination1(this.dataSubject[opt]);
        }else if(i == 1){
          this.combinacionDeHorarioService.setCombination2(this.dataSubject[opt]);
        }else if(i == 2){
          this.combinacionDeHorarioService.setCombination3(this.dataSubject[opt]);
        }
        i++;
      }
    });
    
    this.subjects.subscribe((combination: SubjectCommissions[]) => {
      
      /*console.log(this.options);
      console.log(this.currentSelectedCode, this.options[0]);
      console.log(this.currentSelectedCode, this.options[1]);
      console.log(this.currentSelectedCode, this.options[2]);*/

      if (this.currentSelectedCode == this.options[0]){
        console.log("updating first option");
        this.combinacionDeHorarioService.setCombination1(combination);

      }else if(this.currentSelectedCode == this.options[1]){
        console.log("updating second option");
        this.combinacionDeHorarioService.setCombination2(combination);

      }else if(this.currentSelectedCode == this.options[2]){
        console.log("updating third option");
        this.combinacionDeHorarioService.setCombination3(combination);
        
      }
      console.log("db should be updated");
      this.updateSub.next(
        {
          c1: this.combinacionDeHorarioService.getCombination1(),
          c2: this.combinacionDeHorarioService.getCombination2(),
          c3: this.combinacionDeHorarioService.getCombination3()
        }
      );
        
      
    });
    this.updateObs = this.updateSub.asObservable().pipe(
      debounceTime(5000),
      distinctUntilChanged()
    )
    this.updateObs.subscribe((data: any) => {
      console.log("update db");
      this.dbServices.updateUserSelections(
        data.c1,
        data.c2,
        data.c3
      );

    })

    this.selectOptionSubj.asObservable().pipe(
      debounceTime(10),
      distinctUntilChanged()
    ).subscribe(data =>{
      if (data.last != -1){
        this.selectOption(data.last);
        this.selectOption(data.next);
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.options, event.previousIndex, event.currentIndex);
    /*this.updateSub.next(
      {
        c1: this.combinacionDeHorarioService.getCombination1(),
        c2: this.combinacionDeHorarioService.getCombination2(),
        c3: this.combinacionDeHorarioService.getCombination3()
      }
    );*/ // update db
    //console.log("index = ");
    //console.log(event.currentIndex);

    this.selectOptionSubj.next({
      last: event.previousIndex, 
      next: event.currentIndex
    });
  }
  selectOption(selected: number){
    //console.log(`selected ${selected}`)
    this.currentSelectedCode = this.options[selected];
    this.selectedBehavioural.next(selected);
    //console.log("data subject");
    //console.log(this.dataSubjectModified[this.options[+selected]]);
    this.subjectsBehaviour.next(this.dataSubjectModified[this.options[+selected]]);
    
  }
  subjectChanged(commission: SubjectCommissions){
    //console.log("Subject changed");
    //console.log(commission);
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
