import { Component, OnInit, Input } from '@angular/core';
import { Commission } from '../materia';
import { format, setMinutes, setHours } from 'date-fns';
import { DbServicesService } from '../db-services.service';


@Component({
  selector: 'app-comission-card',
  templateUrl: './comission-card.component.html',
  styleUrls: ['./comission-card.component.css']
})
export class ComissionCardComponent implements OnInit {
  @Input() commission: Commission;
  trendingEnrolledPeople: {[code: string]: number} = null;

  constructor(
    private dbService: DbServicesService
  ) { }

  ngOnInit() {
    this.dbService.getSubjectCommissionsPeople(this.commission.subject)
    .subscribe(
      data =>
      {
        this.trendingEnrolledPeople = data;
      });
  }

  peopleConverter(commission) {
    if (this.trendingEnrolledPeople) {
      if (this.trendingEnrolledPeople.hasOwnProperty(commission.name)) {
        return this.trendingEnrolledPeople[commission.name];
      } else {
        return 0;
      }
    }
  }

  quotaConverter(quota) {
    if (quota > 0) {
      return quota;
    } else {
      return 'Ilimitado';
    }
  }

  myFunc(minutes: number, hours: number): string {
    let myDate: Date = new Date(0);
    myDate = setMinutes(myDate, minutes);
    myDate = setHours(myDate, hours);
    return format(myDate, 'HH:mm');
  }
}
