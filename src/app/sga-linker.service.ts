import { Injectable } from '@angular/core';
import { Subject, Commission, Timeblock } from './materia'
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  AllSubjects: BehaviorSubject<{ [id: string] : Subject; }>;
  AllSubjectsValue : { [id: string] : Subject; };
  AllCommissions;
  url : string = 'https://itbagw.itba.edu.ar/api/v1/courseCommissions/1wXxftFa4NTfsmOstgnQHDq55m7jZL1jq7r7gWlprbHg?level=GRADUATE&year=2019&period=SecondSemester';
  // url : string = 'https://itbagw.itba.edu.ar/api/v1/courseCommissions/1wXxftFa4NTfsmOstgnQHDq55m7jZL1jq7r7gWlprbHg?level=GRADUATE&year=2020&period=FirstSemester';
  constructor(
    private http: HttpClient
  ) {
    this.AllSubjects = new BehaviorSubject<{ [id: string] : Subject; }>({});
    this.getDataFromApi();

  }

  addToAllSubjects(name, commission, currCommission) {
    if(!this.AllSubjectsValue[commission.subjectCode]){
      // if such subject doesn't exist, we create it and then add it to the dictionary
      let currSubject : Subject = {
        name: commission.subjectName,
        code: commission.subjectCode,
        search: (commission.subjectName + commission.subjectCode).toLowerCase(),
        commissions: [currCommission],
        priority: 0
      };
      this.AllSubjectsValue[commission.subjectCode] = currSubject;
    }else{
      // if the subject exists, we just push the comission
      this.AllSubjectsValue[commission.subjectCode].commissions.push(currCommission);
    }
  }

  getAllSubjects() : Observable<{ [id: string] : Subject; }>{
    return this.AllSubjects.asObservable();
  }

  getAllSubjectsAsList() : Observable<Subject[]> {

    // Esta funcion consigue en una lista todos los valores de un diccionario
    let getValues = (dic : {[id: string] : Subject}) : Subject[] => {
      var ans : Subject[] = [];
      for (let key in dic){
        ans.push(dic[key]);
      }
      return ans;
    };

    // Convertimos el observable que usa diccionarios en un observable que usa listas
    return this.getAllSubjects().pipe(
      map( (data :{ [id: string] : Subject; } )  => getValues(data) )
    );
  }

  getAllComissions() {
    return this.http.get(this.url);
  }
  getCommissions(subject : Subject) : Commission[]{

    return this.AllSubjectsValue[subject.code].commissions;
  }

  getDataFromApi(){
    this.getAllComissions().subscribe(data => {
      console.log("data recibida ...");
      console.log(data);

      // here I set what happens when I receive something from get (asynchronous)
      this.AllCommissions = data["courseCommissions"].courseCommission;
      this.AllSubjectsValue = {};

      for (let commission of this.AllCommissions) {
        let name = commission.subjectName;
        let timeBlockArr = [];
        // push each TimeBlock in the commission
        for (let schedule in commission.courseCommissionTimes) {
          let startHHmm = commission.courseCommissionTimes[schedule]["hourFrom"];
          let endHHmm = commission.courseCommissionTimes[schedule]["hourTo"];
          if (startHHmm === undefined || endHHmm === undefined) {
            break;
          }
          startHHmm = startHHmm.split();
          endHHmm = endHHmm.split();
          let currTimeBlock : Timeblock = {
            day: commission.courseCommissionTimes[schedule]["day"],
            start: (parseFloat(startHHmm[0] + parseFloat(startHHmm[1]) / 60.0)),
            end: (parseFloat(endHHmm[0] + parseFloat(endHHmm[1]) / 60.0))
          };

          timeBlockArr.push(currTimeBlock);
        }
        // create the current comission with its current schedule
        let currCommission : Commission = {
          name: commission.commissionName,
          professors: [],
          subject: null,
          schedule: timeBlockArr
        };
        this.addToAllSubjects(name, commission, currCommission);
      }
      this.AllSubjects.next(this.AllSubjectsValue);
      //console.log(this.getCommissionInfo('Álgebra Lineal','A'))
    })
  }
}

