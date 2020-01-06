import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Commission, Timeblock } from '../materia';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-drag-commissions',
  templateUrl: './drag-commissions.component.html',
  styleUrls: ['./drag-commissions.component.css']
})
export class DragCommissionsComponent implements OnInit {
  todo = [];
  done = [];
  selectedCommissions: BehaviorSubject<Commission[]> = new BehaviorSubject([]);

  @Input() commissions: { [letter: string]: Commission; };
  @Output() setCommissionData: EventEmitter<Observable<Commission[]>> = new EventEmitter<Observable<Commission[]>>();
  @Output() onDestroy: EventEmitter<void> = new EventEmitter<void>();

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
        // if (this.done.length == 4){
        //   transferArrayItem(event.previousContainer.data,
        //     event.container.data,
        //     event.previousIndex,
        //     event.currentIndex);
        // }
    }
    this.selectedCommissions.next(this.done);
  }

  constructor() { }

  ngOnInit() {
    this.todo = [];

    let getValues = (dic: {[id: string]: Commission}): Commission[] => {
      var ans : Commission[] = [];
      for (let key in dic){
        ans.push(dic[key]);
      }
      return ans;
    };
    this.todo = getValues(this.commissions);

    this.setCommissionData.emit(this.selectedCommissions.asObservable());
  }
  ngOnDestroy(){
    this.onDestroy.emit();
  }

}
