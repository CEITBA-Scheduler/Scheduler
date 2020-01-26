import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-adjust-menu',
  templateUrl: './adjust-menu.component.html',
  styleUrls: ['./adjust-menu.component.css']
})
export class AdjustMenuComponent implements OnInit {
  timePeriods = [
    'Opcion 1',
    'Opcion 2',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3',
    'Opcion 3'
  ];

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

}
