import { Component, OnInit } from '@angular/core';
import { SgaLinkerService } from '../sga-linker.service';

@Component({
  selector: 'app-show-plans',
  templateUrl: './show-plans.component.html',
  styleUrls: ['./show-plans.component.css']
})
export class ShowPlansComponent implements OnInit {

  careerPlan = null
  constructor(private sgaLinkerService : SgaLinkerService) {  
  }

  ngOnInit() {
    this.sgaLinkerService.getCareerPlan().subscribe(data => {
      this.careerPlan = data
      this.careerPlan.cycles = this.careerPlan.cycles.filter(
        (elem, i, arr) => {
          if (arr.indexOf(elem) === i) {
            return elem
          }
        })
    });
  }
      
}

