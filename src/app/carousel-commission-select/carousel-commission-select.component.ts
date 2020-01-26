import { Component, OnInit, ViewChild } from '@angular/core';
import { Commission } from '../materia';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carousel-commission-select',
  templateUrl: './carousel-commission-select.component.html',
  styleUrls: ['./carousel-commission-select.component.css']
})
export class CarouselCommissionSelectComponent implements OnInit {
  @ViewChild('carousel', {static: false}) carousel: NgbCarousel;

  commissions : Commission[] = [
    {
      name: "A",
      professors: ["Juan", "Martinez"],
      schedule: [{
        day: "Lunes",
        start: {minutes:0, hours:8},
        end: {minutes:0, hours:10}
      }],
    },
    {
      name: "B",
      professors: ["Juan", "Perez"],
      schedule: [{
        day: "Martes",
        start: {minutes:0, hours:8},
        end: {minutes:0, hours:10}
      }]
    },
    {
      name: "C",
      professors: ["Juan", "Orlandez"],
      schedule: [{
        day: "Martes",
        start: {minutes:0, hours:8},
        end: {minutes:0, hours:10}
      }]
    }
  ];

  constructor() { }

  ngOnInit() {
    console.log(this.commissions);
  }
  nextCommission(){
    this.carousel.next();
  }
  prevCommission(){
    this.carousel.prev();
  }
}
