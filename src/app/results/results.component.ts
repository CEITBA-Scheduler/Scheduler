import { Component, OnInit } from '@angular/core';
import { Subject, SubjectCommissions } from '../materia';
import { Observable, BehaviorSubject } from 'rxjs';
import { SgaLinkerService } from '../sga-linker.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  commissionsTest: Observable<SubjectCommissions[]>;
  subjectsBehavioural: BehaviorSubject<SubjectCommissions[]> = new BehaviorSubject([]);

  constructor(private sgaLinkerService: SgaLinkerService) { }

  ngOnInit() {

    this.commissionsTest = this.subjectsBehavioural.asObservable();
    
    this.sgaLinkerService.getDataFromApi();
    //var subjectsData: Subject[] = 
    this.sgaLinkerService.getAllSubjects().subscribe(
      (data: { [id: string]: Subject; }) => {
        //console.log("data = ");
        //console.log(data);

        var subjectCommissionsTest: SubjectCommissions[] = [];

        if (Object.keys(data).length > 0){
          subjectCommissionsTest.push(
            {subject: data["93.02"], commissions: [data["93.02"].commissions[0]]},
            {subject: data["93.03"], commissions: [data["93.03"].commissions[2]]},
            {subject: data["93.18"], commissions: [data["93.18"].commissions[1]]},
            {subject: data["61.19"], commissions: [data["61.19"].commissions[0]]}
          )

        }
        this.subjectsBehavioural.next(subjectCommissionsTest);
      });
  }

}
