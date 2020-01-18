import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef, Input } from '@angular/core';
/*
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
*/
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Time } from '@angular/common';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SubjectCommissions, Subject, Commission } from '../materia';
import { Observable, BehaviorSubject } from 'rxjs';

/* "Dummy" datatypes to simulate obtained data through the algorithm */
interface possibleSchedules {
  weight?: number;          //  Both datatypes won´t be used in current version of the calendar, so they are optional
  priorities?: string[];    //
  subjects: MySubject[];
}

interface MySubject {
  name: string;
  teachers?: string;        // Same as above
  commissionName: string;
  color: string;
  commissionTimes?: CommissionTime[];
}

interface CommissionTime {
  day: string;
  location?: string;       // Same as above
  initialHour: Time | null;
  finalHour: Time | null;
}

interface SubjectBlock{ // graphical subject block
  height: number;
  color: string;
  name: string;
  commission: string;
}

// Uses to list data on the lateral bar (needed checked as extra property so each subject has its own functional checkbox)
interface SubjectList {
  checked: boolean;
  subject: MySubject;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
  @Input() subjectsComissions: Observable<SubjectCommissions[]>; // input de materias

  

  /*schedules: possibleSchedules[] = [
    {
      subjects: [
        { name: 'Algebra', color: '#00fff7', commissionName: 'Comision 2',
        commissionTimes: { day: "Lunes", initialHour: { hours:14, minutes:30 }, finalHour: { hours:18, minutes:30 }}},
        { name: 'Matematica 1', color: '#f9ff33', commissionName: 'Comision 1',
        commissionTimes: { day: "Martes", initialHour: { hours:9, minutes:0 }, finalHour: { hours:11, minutes:0 }}},
        { name: 'PI', color: '#0051ff', commissionName: 'Comision 4',
        commissionTimes: { day: "Miercoles", initialHour: { hours:10, minutes:30 }, finalHour: { hours:14, minutes:0 }}},
        { name: 'Fisica', color: '#00ff13', commissionName: 'Comision 3',
        commissionTimes: { day: "Viernes", initialHour: { hours:13, minutes:0 }, finalHour: { hours:16, minutes:30 }}}
      ]
    }
  ]*/

  // Contains the subject list displayed on the lateral bar. Subjects are shown on the calendar depending on its checkbox status
  subjectList: SubjectList[] = [];
  // Used to plot subjects when in between initialHour and finalHour on subjectOn()
  currentSubjectIndex: number = -1; 
  // Contains all the subjects that can be taken minus the ones that have already been plotted. Using Logica as dummy datatype atm
  
  mySubjectsObs: {[id: string] : BehaviorSubject<MySubject[]>} = {};
  mySubjects: {[id: string] : MySubject[]} = {};

  availableSubjects: MySubject[] = [];
  //[{ name: "Logica", color:"#FF8921", commissionName:"Comision 1", 
  //commissionTimes: { day: "Jueves", initialHour: {hours:8, minutes:0}, finalHour: {hours: 11, minutes: 30} } }];

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  hours: string[] = [];
  
  hoursInteger: string[] = [];
  nextHoursInteger: string[] = [];

  filteredOptions: MySubject[] = [];
  subjectChooserValue: string = '';
  selectedStatus: boolean = true;
  subjectChooserDisabled: boolean = false;
  subjectsOfDay: {[id: string] : SubjectBlock[]} = {
    "Lunes": [],
    "Martes": [],
    "Miercoles": [],
    "Jueves": [],
    "Viernes": []
  };

  constructor(private cd: ChangeDetectorRef) {
    /*for (let day in this.days){
      for (let hour in this.hours){
        this.generateSubjectOn(day, hour);
      }
    }*/
  }

  ngOnInit() {

    this.subjectsOfDay["Lunes"].push(
      {
        height: 70, 
        color: "#00ff04", 
        name: "Matematica I", 
        commission: "A"
      },
      {
        height: 170, 
        color: "#ff0004", 
        name: "Matematica II", 
        commission: "A"
      }
    );

    for (let x = 8; x < 22; x+=0.5) {
      if (x % 2 === 0 || x % 2 === 1){
        this.hours.push(`${x}:00`);
        this.hoursInteger.push(`${x}:00`);
        this.nextHoursInteger.push(`${x+1}:00`);
      }else{
        this.hours.push(`${Math.floor(x)}:30`);
      }
    }
    
    


    this.subjectsComissions.subscribe((subjectsComissions: SubjectCommissions[]) => {
        console.log("Actualizando schedules ...");
      
        /// actualizamos possibleSchedules
        var schedules = [];

        var colors = [
          '#00fff7',
          '#f9ff33',
          '#0051ff',
          '#00ff13'
        ];
        var i = 0;

        for (let subjectComission of subjectsComissions){

          var times = [];

          for (let schedule of subjectComission.commissions[0].schedule){
            times.push({ 
              day: schedule.day, 
              initialHour: { 
                hours:schedule.start.hours, 
                minutes:schedule.start.minutes 
              }, 
              finalHour: { 
                hours:schedule.end.hours, 
                minutes:schedule.end.minutes 
              }
            });
          }

          schedules.push(
            { 
              name: subjectComission.subject.name, 
              color: colors[i], 
              commissionName: subjectComission.commissions[0].name,
              commissionTimes: times
            },
          );
          i++;
        }
        this.subjectList = [];
        for (let i = 0; i < schedules.length ; i++ ) {
          this.subjectList.push( 
            {
              checked: true, subject: Object.assign({}, schedules[i])
            }
          );
        }
        
        for (let day in this.days){
          for (let hour in this.hours){
            this.updateSubjectOn(this.days[day], this.hours[hour]);
          }
        }

    });
  }

  updateSubjectOnv2(){ // segunda version de esta funcion, la idea es que en
    //una sola pasada actualize todo

    for (let m = 0 ; m < this.subjectList.length; m++) {
      // por cada materia
      for (let i = 0;i < this.subjectList[m].subject.commissionTimes.length;i++){
        // por cada horario de la materia
        

      }
    }
  }


  updateSubjectOn(day: string, hour: string){
    //console.log("updated subject on ", (day +" "+ hour));

    var subject : MySubject[];

    //console.log(this.subjectList);
    var m: number;
    //console.log(day + " " + hour);
    subject = [{ name:"", color:"", commissionName:""}];

    for (m = 0 ; m < this.subjectList.length; m++) {
      for (let i = 0;i < this.subjectList[m].subject.commissionTimes.length;i++){
        //console.log( hour, this.subjectList[m].subject.commissionTimes);
        /*console.log(this.hourToString(
          this.subjectList[m].subject.commissionTimes[i].finalHour.hours, 
          this.subjectList[m].subject.commissionTimes[i].finalHour.minutes) );*/
        if (day === this.subjectList[m].subject.commissionTimes[i].day) {
          if (hour === 
            this.hourToString(this.subjectList[m].subject.commissionTimes[i].initialHour.hours, 
              this.subjectList[m].subject.commissionTimes[i].initialHour.minutes) 
              && this.subjectList[m].checked
              ) {
            
            subject = [this.subjectList[m].subject];
            this.currentSubjectIndex = m;
                //console.log("start");
            break;
          }
          else if (
            hour === this.hourToString(
              this.subjectList[m].subject.commissionTimes[i].finalHour.hours, 
              this.subjectList[m].subject.commissionTimes[i].finalHour.minutes) 
            && this.subjectList[m].checked
            ) {
              //console.log("end");
            subject = [{ name:"", color:"", commissionName:""}];
            this.currentSubjectIndex = -1; // So that no subject have an index equal to currentSubjectIndex
            break;
          }
          else if (m === this.currentSubjectIndex && this.subjectList[m].checked) {
            subject = [this.subjectList[m].subject];
            break;
          }
        }
      }
    }

    if (!((day + " " + hour) in this.mySubjectsObs)){
      this.generateSubjectOn(day, hour);
    }
    

    this.mySubjectsObs[(day +" "+ hour)].next(subject);
    
  }
  // Checks if there's a subject on the day and hour sent
  subjectOn (day: string, hour: string): Observable<MySubject[]> {
    // usando this.subjectList calcula el valor de subject
    if (!((day + " " + hour) in this.mySubjects)){
      this.generateSubjectOn(day, hour);
    }
    return this.mySubjectsObs[(day + " " + hour)].asObservable();
    // sino lo generaemos

  }
  generateSubjectOn(day: string, hour: string){ // we generate al Subjects
    this.mySubjectsObs[(day +" "+ hour)] = new BehaviorSubject([{ name:"", color:"", commissionName:""}]);
    /*this.mySubjectsObs[(day +" "+ hour)].asObservable().subscribe(
      data =>
        { 
          if (data[0].name != ""){
            console.log("data no nula");
            console.log(data);
          }else{
           //console.log("data nula");
          }
        }
      
    )*/
  }


  hourToString (hour: number, minutes: number): String {
    if (minutes.toString() !== "0")
      return hour.toString() + ":" + minutes.toString();
    else
      return hour.toString() + ":" + minutes.toString() + "0";
  }

  displayFn(subject?: MySubject): string | undefined {
    return subject ? subject.name : undefined;
  }

  onSubjectChooserChange() {
    this.filteredOptions = this.availableSubjects.filter(subj =>
      subj.name.toLowerCase().startsWith(this.subjectChooserValue.toLowerCase())
    );
  }

  subjectSelected(event: MatAutocompleteSelectedEvent) {
    const selectedSubject: MySubject = event.option.value;
    this.subjectList.push( {checked: true, subject: Object.assign({}, selectedSubject)} );
    this.availableSubjects.splice(this.availableSubjects.indexOf(selectedSubject), 1);
    console.log(this.availableSubjects.length);
    this.subjectChooserValue = "";
    this.onSubjectChooserChange();
    if (this.availableSubjects.length == 0) 
      this.subjectChooserDisabled = true;
    this.cd.detectChanges();
  }

  deleteComissionFromList(subj: MySubject) {
    for (let i = 0 ; i < this.subjectList.length ; i++) {
      if (this.subjectsAreEqual(subj, this.subjectList[i].subject)) {
        this.subjectList.splice(i, 1);
        this.availableSubjects.push(subj);
      }
    }
    this.subjectChooserDisabled = false;
  }

  subjectsAreEqual(subj1: MySubject, subj2: MySubject): boolean {
    if ( subj1.name === subj2.name
      && subj1.color === subj2.color
      && subj1.commissionName === subj2.commissionName
      && subj1.commissionTimes === subj2.commissionTimes
      && subj1.teachers === subj2.teachers )
      return true;
    else
      return false;
  }

}
