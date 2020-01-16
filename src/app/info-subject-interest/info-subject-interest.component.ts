import { Component, OnInit } from '@angular/core';
import { SgaLinkerService } from '../sga-linker.service';
import { DbServicesService } from '../db-services.service';
import { Subject } from '../materia';

@Component({
  selector: 'app-info-subject-interest',
  templateUrl: './info-subject-interest.component.html',
  styleUrls: ['./info-subject-interest.component.css']
})
export class InfoSubjectInterestComponent implements OnInit {

  targetSubject: Subject;

  constructor(private sgaLinkerService: SgaLinkerService,
    private dbService: DbServicesService) { }

  ngOnInit() {
    this.sgaLinkerService.getAllSubjects().subscribe(data => {
      this.dbService.subscribeToSubjectInfo(
        data
      );
    });
  }
  addMateria(subject: Subject){
    // select subject as target
    this.targetSubject = subject;
    
  }

}
