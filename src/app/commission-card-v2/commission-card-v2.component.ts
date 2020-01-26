import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { format, setMinutes, setHours } from 'date-fns';
import { Commission } from '../materia';

@Component({
  selector: 'app-commission-card-v2',
  templateUrl: './commission-card-v2.component.html',
  styleUrls: ['./commission-card-v2.component.css']
})
export class CommissionCardV2Component implements OnInit {

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
