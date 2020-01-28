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
  areCombinationsAvailable = true;

  hearts: Observable<string[]> = of([]);

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  /**
   * Adding some private code to manage which part of the combinations
   * list will be used to be displayed as a slide
   */
  public leftSlideIndex = null;
  public rightSlideIndex = null;
  public  slideCombinations: Combination[];

  constructor(
    private router: Router,
    private dbServices: DbServicesService,
    private combinacionDeHorarioService: CombinacionDeHorarioService) {
      
     }

  ngOnInit() {
    
    this.combinations = this.combinacionDeHorarioService.getAlgorithmResults();
    // If combinations is empty, the boolean (used along with *ngIf on .html) turns to false
    if (this.combinations.length === 0) {
      this.areCombinationsAvailable = false;
    } else {
      for (let combination = 0 ; combination < this.combinations.length ; combination++) {
        this.combinationNames.push(`${(+combination + 1)}`);
      }

      this.hearts = this.combinacionDeHorarioService.getHeartList();

      let i = 0;
      for (const combination of this.combinations) {
        const coms: SubjectCommissions[] = generateSubjectCommissionsFromCombionation(combination);
        this.subjectsBehavioural.push(new BehaviorSubject(coms));
        this.commissions.push(this.subjectsBehavioural[i].asObservable());
        i++;
      }

      // Selecting a slice of the combinations
      // here we initializate the variables needed for changing the
      // loaded slides into the carousel
      this.updateSlideCombinations();
    }
  }
  generateSlideId(index: number) {
    return `ngb-slide-${index + this.leftSlideIndex}`;
  }

  updateSlideCombinations(action: string = 'default') {
    const DEFAULT_LEFT = 0;
    const DEFAULT_RIGHT = 9;

    switch (action) {
      case 'default':
        this.leftSlideIndex = DEFAULT_LEFT;
        this.rightSlideIndex = this.combinations.length <= DEFAULT_RIGHT ? this.combinations.length - 1 : DEFAULT_RIGHT;
        break;
      case 'left':
        this.leftSlideIndex -= 1;
        this.rightSlideIndex -= 1;
        break;
      case 'right':
        this.leftSlideIndex += 1;
        this.rightSlideIndex += 1;
        break;
    }

    this.slideCombinations = this.combinations.slice(this.leftSlideIndex, this.rightSlideIndex + 1);
  }

  loadMore(event) {
    if (event.hasOwnProperty('current')) {
      const currentArray = event.current.split('-');
      const currentIndex = Number(currentArray[currentArray.length - 1]);
      if (currentIndex > 0) {
        if (currentIndex === this.leftSlideIndex) {
          this.updateSlideCombinations('left');
        } else if (currentIndex === this.rightSlideIndex) {
          this.updateSlideCombinations('right');
        }
      }
    }
  }

  select() {
    this.router.navigate(['/menuFinal']);
  }

  back() {
    this.router.navigate(['/combinadorDeHorarios']);
  }

  selected(selected: string, state: boolean) {
    this.combinacionDeHorarioService.changeHeartList(selected, state);
  }

  selectSlide(slide: string) {
    this.carousel.select('ngb-slide-' + (+slide - 1));
  }

  returnToCombiner() {
    this.router.navigate(['/combinadorDeHorarios']);
  }

  done() {
    /*this.dbServices.updateUserSelections(
      this.combinacionDeHorarioService.getCombination1(),
      this.combinacionDeHorarioService.getCombination2(),
      this.combinacionDeHorarioService.getCombination3()
    );*/
  }
}
