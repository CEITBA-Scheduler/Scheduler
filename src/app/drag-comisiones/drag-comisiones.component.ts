import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Commission, Timeblock } from '../materia';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-drag-comisiones',
  templateUrl: './drag-comisiones.component.html',
  styleUrls: ['./drag-comisiones.component.css']
})
export class DragComisionesComponent implements OnInit {
  todo = [];
  done = [];

  @Input() commissions: { [letter: string]: Commission; };
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
    for (let key in this.commissions){
      this.todo.push(this.commissions[key]);
    }
  }

}
