import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Commission, SubjectCommissions, generateSubjectCommissionsFromCombionation } from '../materia';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { Combination } from '../algorithm/algorithm-object';
import { Observable, BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-adjust-menu',
  templateUrl: './adjust-menu.component.html',
  styleUrls: ['./adjust-menu.component.css']
})
export class AdjustMenuComponent implements OnInit {
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
  
  subjects: Observable<SubjectCommissions[]>; // combinacion almacenada por la materia
  subjectsBehaviour: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject([]);

  constructor(private combinacionDeHorarioService: CombinacionDeHorarioService) { }

  ngOnInit() {
    this.algorithmResults = this.combinacionDeHorarioService.getAlgorithmResults();

    this.selectedOption = this.selectedBehavioural.asObservable();
    this.subjects = this.subjectsBehaviour.asObservable();

    this.combinacionDeHorarioService.getHeartList().subscribe((options: string[]) => {
      this.options = options

      for (let option of this.options){
        this.dataSubject[option] = generateSubjectCommissionsFromCombionation(this.algorithmResults[+option-1]);
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
    this.selectedBehavioural.next(+selected);
    this.subjectsBehaviour.next(this.dataSubject[this.options[+selected]]);
    
  }

}
