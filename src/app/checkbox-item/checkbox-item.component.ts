import { GeneralProgramService } from './../general-program.service';
import { Component, OnInit, Input } from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
@Component({
  selector: 'app-checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['./checkbox-item.component.css']
})
export class CheckboxItemComponent implements OnInit {
  @Input() name: string;

  constructor(private generalProgramService: GeneralProgramService) { }

  ngOnInit() {
    this.generalProgramService.createCheckbox(this.name); // crea un nuevo checkbox con nuestro nombre en el servicio
  }
  changeStatus(checkStatus: MatCheckboxChange) { // esta funcion se llama cuando cambia de estado el checkbox, matCheckboxChange contiene el cambio de estado
    this.generalProgramService.updateCheckbox(this.name, checkStatus.checked); // le aviso al servicio que cambio de estado el checkbox
  }
}
