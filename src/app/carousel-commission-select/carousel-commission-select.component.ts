import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Subject, Commission, SubjectCommissions } from '../materia';
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
  @Input() data: Observable<SubjectCommissions>;

  @Output() subjectCommissionUpdate: EventEmitter<SubjectCommissions> = new EventEmitter<SubjectCommissions>();

  startCommission: string = "";
  subject: Subject = null;

  commissions : Commission[] = [];

  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
    if (this.data){
      this.data.subscribe((data: SubjectCommissions) => {
        console.log("new data");
        console.log(data);
        
        this.commissions = this.sgaLinkerService.getCommissions(data.subject);
        
        if (this.carousel){
          this.carousel.select(data.commissions[0].name);
        }else{
          this.startCommission = data.commissions[0].name;
        }
        this.subject = data.subject;

      });
      

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
          subject: this.subject,
          commissions: [this.commissions[index]]
        }
      );
    }
  }
}
