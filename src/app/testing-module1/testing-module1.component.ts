import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Subject, SubjectCommissions } from '../materia';
import { SgaLinkerService } from '../sga-linker.service';
import { DbServicesService } from '../db-services.service';

@Component({
  selector: 'app-testing-module1',
  templateUrl: './testing-module1.component.html',
  styleUrls: ['./testing-module1.component.css']
})
export class TestingModule1Component implements OnInit {

  subjects : Observable<SubjectCommissions[]>;
  subjectsBehavioural: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject<SubjectCommissions[]>([]);

  constructor(private sgaLinkerService: SgaLinkerService, private dbServices: DbServicesService) { }

  ngOnInit() {

    this.subjects = this.subjectsBehavioural.asObservable();

    this.sgaLinkerService.getSubjectsDataFromApi();
    //var subjectsData: Subject[] =
    this.sgaLinkerService.getAllSubjects().subscribe(
      (data: { [id: string]: Subject }) => {
        //console.log("data = ");
        //console.log(data);
        if (Object.keys(data).length > 0){
          console.log(data);
          console.log("Informacion de comisión:");
          this.dbServices.getSubjectCommissionsPeople(data["93.02"]).subscribe(data => {
            console.log(data);
          });
        }

        /*var subjectCommissionsTest: SubjectCommissions[] = [];

        if (Object.keys(data).length > 0){
          subjectCommissionsTest.push(
            {subject: data["93.02"], commissions: [data["93.02"].commissions[0]]},
            {subject: data["93.03"], commissions: [data["93.03"].commissions[2]]},
            {subject: data["93.18"], commissions: [data["93.18"].commissions[1]]},
            {subject: data["61.19"], commissions: [data["61.19"].commissions[0]]}
          )

        }
        this.subjectsBehavioural.next(subjectCommissionsTest);*/
      }
    );
  }
}




