import { Component, OnInit, Input } from '@angular/core';
import { Commission } from '../materia';

@Component({
  selector: 'app-comission-card',
  templateUrl: './comission-card.component.html',
  styleUrls: ['./comission-card.component.css']
})
export class ComissionCardComponent implements OnInit {

  @Input() commission: Commission;
  
  constructor() { }

  ngOnInit() {

  }
}