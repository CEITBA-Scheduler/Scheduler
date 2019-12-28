import { Component, OnInit, Input } from '@angular/core';
import { Comission } from '../materia';

@Component({
  selector: 'app-comission-card',
  templateUrl: './comission-card.component.html',
  styleUrls: ['./comission-card.component.css']
})
export class ComissionCardComponent implements OnInit {

  @Input() comission: Comission;
  
  constructor() { }

  ngOnInit() {

  }
}
