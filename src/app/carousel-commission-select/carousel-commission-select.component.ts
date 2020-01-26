import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Commission, SubjectCommissions } from '../materia';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SgaLinkerService } from '../sga-linker.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-carousel-commission-select',
  templateUrl: './carousel-commission-select.component.html',
  styleUrls: ['./carousel-commission-select.component.css']
})
export class CarouselCommissionSelectComponent implements OnInit {
  @ViewChild('carousel', {static: false}) carousel: NgbCarousel;
  @Input() data: SubjectCommissions;
  startCommission: string = "";

  commissions : Commission[] = [];

  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
    if (this.data){
      this.commissions = this.sgaLinkerService.getCommissions(this.data.subject);
      this.startCommission = this.data.commissions[0].name;

      // Do something after
    }
  }
  nextCommission(){
    this.carousel.next();
  }
  prevCommission(){
    this.carousel.prev();
  }
}
