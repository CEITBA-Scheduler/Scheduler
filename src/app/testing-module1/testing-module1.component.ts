import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Subject, SubjectCommissions } from '../materia';
import { SgaLinkerService } from '../sga-linker.service';

@Component({
  selector: 'app-testing-module1',
  templateUrl: './testing-module1.component.html',
  styleUrls: ['./testing-module1.component.css']
})
export class TestingModule1Component implements OnInit {

  subjects : Observable<SubjectCommissions[]>;
  subjectsBehavioural: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject<SubjectCommissions[]>([]);

  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {
    this.subjects = this.subjectsBehavioural.asObservable();
    
    this.sgaLinkerService.getDataFromApi();
    //var subjectsData: Subject[] = 
    this.sgaLinkerService.getAllSubjects().subscribe(
      (data: { [id: string]: Subject; }) => {
        //console.log("data = ");
        //console.log(data);

        var subjectCommissionsTest: SubjectCommissions[] = [];

        if (Object.keys(data).length > 0){
          subjectCommissionsTest.push(
            {subject: data["93.02"], commissions: [data["93.02"].commissions[1]]},
            {subject: data["93.03"], commissions: [data["93.03"].commissions[1]]},
            {subject: data["93.18"], commissions: [data["93.18"].commissions[3]]}
          )

        }
        this.subjectsBehavioural.next(subjectCommissionsTest);
      }
    ); 
  }
}




