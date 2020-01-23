import { Component, OnInit, Input } from '@angular/core';
import { Commission } from '../materia';
import { format, setMinutes, setHours } from 'date-fns';


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
  myFunc(minutes: number, hours: number): string{
    var myDate: Date = new Date(0);
    myDate = setMinutes(myDate, minutes);
    myDate = setHours(myDate, hours);

    return format(myDate, "HH:mm");
  }
}
