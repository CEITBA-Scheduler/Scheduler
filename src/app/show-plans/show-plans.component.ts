import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-plans',
  templateUrl: './show-plans.component.html',
  styleUrls: ['./show-plans.component.css']
})
export class ShowPlansComponent implements OnInit {
  materiasPlan : string[] = []
  materiasCuatri : string[] = []


  constructor() {  
    this.materiasCuatri.push("1er año primer cuatri") 
    this.materiasPlan.push("Fisica")
    this.materiasPlan.push("Mate")    
    
  }

  ngOnInit() {
  }

}

