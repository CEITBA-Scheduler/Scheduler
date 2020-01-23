
import { CombinacionDeHorarioService } from './../combinacion-de-horario.service';
import { Component, OnInit } from '@angular/core';
import { Subject, SubjectCommissions, generateSubjectCommissionsFromCombionation } from '../materia';
import { Observable, BehaviorSubject } from 'rxjs';
import { SgaLinkerService } from '../sga-linker.service';
import {
  SubjectSelection,
  Priority,
  Combination
} from '../algorithm/algorithm-object';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  commissions: Observable<SubjectCommissions[]>[] = [];

  subjectsBehavioural: BehaviorSubject<SubjectCommissions[]>[] = [];

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  combinations: Combination[];

  constructor(private router: Router, private sgaLinkerService: SgaLinkerService, private combinacionDeHorarioService: CombinacionDeHorarioService) { }

  ngOnInit() {

    this.combinations = this.combinacionDeHorarioService.getAlgorithmResults();

    //this.commissionsTest = this.subjectsBehavioural.asObservable();
    //this.sgaLinkerService.getDataFromApi();
    //var subjectsData: Subject[] =

    /*this.sgaLinkerService.getAllSubjects().subscribe(
      (data: { [id: string]: Subject; }) => {
        //console.log("data = ");
        //console.log(data);

        var subjectCommissionsTest: SubjectCommissions[] = [];

        if (Object.keys(data).length > 0){
          subjectCommissionsTest.push(
            {subject: data["93.02"], commissions: [data["93.02"].commissions[0]]},
            {subject: data["93.03"], commissions: [data["93.03"].commissions[2]]},
            {subject: data["93.18"], commissions: [data["93.18"].commissions[1]]},
            {subject: data["61.19"], commissions: [data["61.19"].commissions[0]]}
          )

        }
        this.subjectsBehavioural.next(subjectCommissionsTest);
      });*/
    //this.sgaLinkerService.getAllSubjects().subscribe(
     // (data: { [id: string]: Subject; }) => {

    //});

    var i = 0;

    for (let combination of this.combinations){
      var coms: SubjectCommissions[] = generateSubjectCommissionsFromCombionation(combination);
      this.subjectsBehavioural.push(new BehaviorSubject(coms));
      this.commissions.push(this.subjectsBehavioural[i].asObservable());
      i ++;
    }

  }
  select(){
    this.router.navigate(['/menuFinal']);
  }
  back(){
    this.router.navigate(['/combinadorDeHorarios']);
  }
}
