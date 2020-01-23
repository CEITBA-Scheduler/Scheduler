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
      console.log("Este es el plan by lucas")
      console.log(this.careerPlan)
    });
  }

}

