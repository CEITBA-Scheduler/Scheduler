import { GeneralProgramService } from './../general-program.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['./checkbox-item.component.css']
})
export class CheckboxItemComponent implements OnInit {
  @Input() name: string;
  @Input() storeName: string;
  @Input() startChecked: Observable<boolean>;
  checked: boolean = false;

  constructor(private generalProgramService: GeneralProgramService) { }

  ngOnInit() {
    if (this.startChecked){
      //console.log(this.startChecked);
      this.startChecked.subscribe((data: boolean) => {
        this.checked = data;
      });
    }
    this.generalProgramService.createCheckbox(this.storeName); // crea un nuevo checkbox con nuestro nombre en el servicio
  }
  changeStatus(checkStatus: MatCheckboxChange) { // esta funcion se llama cuando cambia de estado el checkbox, matCheckboxChange contiene el cambio de estado
    this.generalProgramService.updateCheckbox(this.storeName, checkStatus.checked); // le aviso al servicio que cambio de estado el checkbox
  }
}
