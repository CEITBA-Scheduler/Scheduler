import { Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { SubjectCommissions } from '../materia';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DbServicesService } from '../db-services.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-final-menu',
  templateUrl: './final-menu.component.html',
  styleUrls: ['./final-menu.component.css']
})
export class FinalMenuComponent implements OnInit {

  constructor(
    private combinacionDeHorariosService: CombinacionDeHorarioService,
    private router: Router,
    private dbServices: DbServicesService) { }


  sel1: SubjectCommissions[] = null;
  sel2: SubjectCommissions[] = null;
  sel3: SubjectCommissions[] = null;

  selection1: Observable<SubjectCommissions[]>;
  selection2: Observable<SubjectCommissions[]>;
  selection3: Observable<SubjectCommissions[]>;

  sendData1: Observable<SubjectCommissions[]>;
  sendData2: Observable<SubjectCommissions[]>;
  sendData3: Observable<SubjectCommissions[]>;

  ngOnInit() {
    this.selection1 = this.combinacionDeHorariosService.getCombination1Obs();
    this.selection2 = this.combinacionDeHorariosService.getCombination2Obs();
    this.selection3 = this.combinacionDeHorariosService.getCombination3Obs();

    /*this.sendData1 = this.selection1.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    );
    this.sendData2 = this.selection2.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    this.sendData3 = this.selection3.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )

    this.selection1.subscribe((data: SubjectCommissions[]) =>{
      this.sel1 = data;
      console.log("sel 1");
      console.log(this.sel1);

    });
    this.selection2.subscribe((data: SubjectCommissions[]) =>{
      this.sel2 = data;
      console.log("sel 2");
      console.log(this.sel2);

    });
    this.selection3.subscribe((data: SubjectCommissions[]) =>{
      this.sel3 = data;
      console.log("sel 3");
      console.log(this.sel3);

    });

    this.sendData1.subscribe((data: SubjectCommissions[]) => {
      console.log("updating sel 1");
      this.dbServices.updateUserSelection1(
        data
      )
    });
    this.sendData2.subscribe((data: SubjectCommissions[]) => {
      console.log("updating sel 2");
      this.dbServices.updateUserSelection2(
        data
      )
    });
    this.sendData3.subscribe((data: SubjectCommissions[]) => {
      console.log("updating sel 3");
      this.dbServices.updateUserSelection3(
        data
      )
    });*/

    /*this.dbServices.updateUserSelections(
      this.sel1,
      this.sel2,
      this.sel3
    );*/
  }
  done(){
    this.router.navigate(['/credits']);
    
  }

}
