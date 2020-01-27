import { Component, OnInit } from '@angular/core';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { SubjectCommissions } from '../materia';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DbServicesService } from '../db-services.service';

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

  ngOnInit() {
    this.selection1 = this.combinacionDeHorariosService.getCombination1Obs();
    this.selection2 = this.combinacionDeHorariosService.getCombination2Obs();
    this.selection3 = this.combinacionDeHorariosService.getCombination3Obs();

    this.selection1.subscribe((data: SubjectCommissions[]) =>{
      this.sel1 = data;
    });
    this.selection2.subscribe((data: SubjectCommissions[]) =>{
      this.sel2 = data;
    });
    this.selection3.subscribe((data: SubjectCommissions[]) =>{
      this.sel3 = data;
    });

  }
  done(){
    this.router.navigate(['/credits']);
    this.dbServices.updateUserSelections(
      this.sel1,
      this.sel2,
      this.sel3
    );
  }

}
