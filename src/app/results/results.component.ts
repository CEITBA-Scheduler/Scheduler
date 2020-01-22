import { Component, OnInit } from '@angular/core';
import { SubjectCommissions } from '../materia';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  commissionsTest: Observable<SubjectCommissions[]>;

  constructor() { }

  ngOnInit() {
    this.commissionsTest = new BehaviorSubject<SubjectCommissions[]>([]).asObservable();
  }

}
