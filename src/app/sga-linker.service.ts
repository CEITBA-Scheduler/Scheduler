import { Injectable } from '@angular/core';
import { Subject, Commission, Timeblock } from './materia';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { parse } from 'date-fns';
import { UserSelection } from './materia';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { token } from './secrets';

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  AllSubjects: BehaviorSubject<{ [id: string]: Subject; }>;
  AllSubjectsValue: { [id: string]: Subject; };
  AllCommissions;
  url : string = "https://itbagw.itba.edu.ar/api/v1/courseCommissions/"+token.CEITBA+"?level=GRADUATE&year=2020&period=FirstSemester";

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.AllSubjects = new BehaviorSubject<{ [id: string] : Subject; }>({});
    this.getDataFromApi();

  }
  removeTildes(word: string){
    return word.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u");
  }
  addToAllSubjects(name, commission, currCommission) {
    if(!this.AllSubjectsValue[commission.subjectCode]){
      // if such subject doesn't exist, we create it and then add it to the dictionary
      let currSubject : Subject = {
        name: commission.subjectName,
        code: commission.subjectCode,
        search: this.removeTildes((commission.subjectName + commission.subjectCode).toLowerCase()),
        commissions: [currCommission],
        priority: 0
      };
      this.AllSubjectsValue[commission.subjectCode] = currSubject;
    }else{
      // if the subject exists, we just push the comission
      this.AllSubjectsValue[commission.subjectCode].commissions.push(currCommission);
    }
  }

  getAllSubjects() : Observable<{ [id: string]: Subject; }> {
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
      //console.log("data recibida ...");
      //console.log(data);

      // here I set what happens when I receive something from get (asynchronous)
      this.AllCommissions = data["courseCommissions"].courseCommission;
      this.AllSubjectsValue = {};

      for (let commission of this.AllCommissions) {
        let name = commission.subjectName;
        let timeBlockArr = []
        // push each TimeBlock in the commission
        for(let schedule in commission.courseCommissionTimes){

          var startDate: Date = parse(commission.courseCommissionTimes[schedule]["hourFrom"], 'HH:mm', new Date());
          var endDate: Date = parse(commission.courseCommissionTimes[schedule]["hourTo"], 'HH:mm', new Date());

          let currTimeBlock : Timeblock = {
            day: this.convertName(commission.courseCommissionTimes[schedule]["day"]),
            start: {hours:startDate.getHours(), minutes:startDate.getMinutes()},
            end: {hours:endDate.getHours(), minutes:endDate.getMinutes()}
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
  convertName(name: string){
    if (name == "MONDAY"){
      return "Lunes";
    }else if(name == "TUESDAY"){
      return "Martes";
    }else if(name == "WEDNESDAY"){
      return "Miércoles";
    }else if(name == "THURSDAY"){
      return "Jueves";
    }else if(name == "FRIDAY"){
      return "Viernes";
    }
    return "Indefinido";
  }

  /*private getUserObjectFromUserSelection(userSelection: UserSelection) : User{


    return user;
  }*/
}

