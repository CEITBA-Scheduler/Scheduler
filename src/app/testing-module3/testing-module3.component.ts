import { Component, OnInit } from '@angular/core';
import { DbServicesService } from '../db-services.service';

@Component({
  selector: 'app-testing-module3',
  templateUrl: './testing-module3.component.html',
  styleUrls: ['./testing-module3.component.css']
})
export class TestingModule3Component implements OnInit {

  constructor(private dbServices: DbServicesService) { 
  
  }

  ngOnInit() {
  }

}
