import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Commission, SubjectCommissions } from '../materia';
import { NgbCarousel, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
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

  @Output() subjectCommissionUpdate: EventEmitter<SubjectCommissions> = new EventEmitter<SubjectCommissions>();

  startCommission: string = "";

  commissions : Commission[] = [];

  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
    if (this.data){
      this.commissions = this.sgaLinkerService.getCommissions(this.data.subject);
      this.startCommission = this.data.commissions[0].name;
      console.log("commissions");
      console.log(this.commissions);

      // Do something after
    }
  }
  nextCommission(){
    this.carousel.next();
  }
  prevCommission(){
    this.carousel.prev();
  }
  changeSlide(event: NgbSlideEvent){
    var index: string = "no";
    for (var com in this.commissions){
      if (this.commissions[com].name == event.current){
        index = com;
      }
    }
    if (index != "no"){
      console.log("emitted");
      console.log(this.commissions[index]);

      this.subjectCommissionUpdate.emit(
        {
          subject: this.data.subject,
          commissions: [this.commissions[index]]
        }
      );
    }
  }
}
