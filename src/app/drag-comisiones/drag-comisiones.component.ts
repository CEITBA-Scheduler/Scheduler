import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Comission, Timeblock } from '../materia';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-drag-comisiones',
  templateUrl: './drag-comisiones.component.html',
  styleUrls: ['./drag-comisiones.component.css']
})
export class DragComisionesComponent implements OnInit {
  todo = [
  ];
  done = [

  ];
  @Input() comissions: { [letter: string]: Comission; };
  @Output() selected: EventEmitter<string[]> = new EventEmitter<string[]>();

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
        if (this.done.length == 4){
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
        }
    }
  }

  constructor() { }

  ngOnInit() {
    console.log("ng on init");
    
    console.log(this.comissions);
    for (let key in this.comissions){
      this.todo.push(this.comissions[key]);
    }
  }

}
