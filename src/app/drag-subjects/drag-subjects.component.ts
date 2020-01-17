import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Observable, BehaviorSubject } from 'rxjs';
import { Subject } from '../materia';

@Component({
  selector: 'app-drag-subjects',
  templateUrl: './drag-subjects.component.html',
  styleUrls: ['./drag-subjects.component.css']
})
export class DragSubjectsComponent implements OnInit {
  //todo = []; //en lugar de todo uso subjects
  done = [];
  @Input() subjects:Subject[];
  selectedSubjects: BehaviorSubject<Subject[]> = new BehaviorSubject([]);

  //@Output() setData: EventEmitter<Observable<Subject[]>> = new EventEmitter<Observable<Subject[]>>();
  @Output() setSubjectData: EventEmitter<Observable<Subject[]>> = new EventEmitter<Observable<Subject[]>>();
  @Output() onDestroy: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

    }
    this.selectedSubjects.next(this.done); //cambie subjects por done
  }

  ngOnInit() {
    
  }

}








