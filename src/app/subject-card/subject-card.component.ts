import { Component, OnInit, Input } from '@angular/core';
import { Subject } from '../materia';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.css']
})
export class SubjectCardComponent implements OnInit {

  @Input() subject: Subject;
  
  constructor() { }

  ngOnInit() {
  }

}
