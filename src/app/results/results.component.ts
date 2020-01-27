
import { CombinacionDeHorarioService } from './../combinacion-de-horario.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, SubjectCommissions, generateSubjectCommissionsFromCombionation } from '../materia';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { SgaLinkerService } from '../sga-linker.service';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import {
  SubjectSelection,
  Priority,
  Combination
} from '../algorithm/algorithm-object';
import { Router } from '@angular/router';
import { DbServicesService } from '../db-services.service';

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @ViewChild('carousel', {static: false}) carousel: NgbCarousel;

  commissions: Observable<SubjectCommissions[]>[] = [];

  subjectsBehavioural: BehaviorSubject<SubjectCommissions[]>[] = [];

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  combinations: Combination[];
  combinationNames: string[] = [];
  // By default, the program suposes it will recieve at least one combination
  areCombinationsAvailable: boolean = true;

  hearts: Observable<string[]> = of([]);
  
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(
    private router: Router, 
    private sgaLinkerService: SgaLinkerService, 
    private combinacionDeHorarioService: CombinacionDeHorarioService,
    private dbServices: DbServicesService) 
    { }

  ngOnInit() {

    this.combinations = this.combinacionDeHorarioService.getAlgorithmResults();
    
    // If combinations is empty, the boolean (used along with *ngIf on .html) turns to false
    if (this.combinations.length === 0)
      this.areCombinationsAvailable = false;
    else {
      for (let combination in this.combinations){
        this.combinationNames.push(`${(+combination+1)}`);
      }

      this.hearts = this.combinacionDeHorarioService.getHeartList();
      this.combinacionDeHorarioService.resetHeartList();
      
      // the next lines must be erased
      console.log(this.combinations);

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
      
      // the last lines must be erased
      
      var i = 0;

      for (let combination of this.combinations){
        var coms: SubjectCommissions[] = generateSubjectCommissionsFromCombionation(combination);
        this.subjectsBehavioural.push(new BehaviorSubject(coms));
        this.commissions.push(this.subjectsBehavioural[i].asObservable());
        i ++;
      }
    }

  }
  select(){
    this.router.navigate(['/menuFinal']);
  }
  back(){
    this.router.navigate(['/combinadorDeHorarios']);
  }
  selected(selected: string, state: boolean){
    console.log("El estado de la opcion ", selected," paso a ", state);
    this.combinacionDeHorarioService.changeHeartList(selected, state);
  }
  selectSlide(slide: string){
    console.log(`Select slide ${+slide}`)
    this.carousel.select('ngb-slide-' + (+slide-1));
  }
  returnToCombiner() {
    this.router.navigate(['/combinadorDeHorarios']);
  }
  done(){
    console.log("updating db");
    this.dbServices.updateUserSelections(
      this.combinacionDeHorarioService.getCombination1(),
      this.combinacionDeHorarioService.getCombination2(),
      this.combinacionDeHorarioService.getCombination2()
    );
  }
}
