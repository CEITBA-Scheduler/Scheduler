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
  todo: Commission[] = [];
  done: Commission[] = [];
  selectedCommissions: BehaviorSubject<Commission[]> = new BehaviorSubject([]);

  @Input() commissions: { [letter: string]: Commission; };
  @Input() preSelectedCommissions: Observable<Commission[]>;

  @Output() setCommissionData: EventEmitter<Observable<Commission[]>> = new EventEmitter<Observable<Commission[]>>();
  @Output() onDestroy: EventEmitter<void> = new EventEmitter<void>();

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      var num1 = Number(event.previousContainer._dropListRef.id.replace(/\D/g, ''));
      var num2 = Number(event.container._dropListRef.id.replace(/\D/g, ''));
      
      if(num1<num2){
          //num1 is on the left, I am adding from TODO to DONE
          if(this.done.length <= 2){
            transferArrayItem(event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex);
          }

      }else{
          //num1 is on the right, I am poping items from DONE to TODO
          transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
      }
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
    this.todo = getValues(this.commissions); // this is all comissions from the subject

    this.setCommissionData.emit(this.selectedCommissions.asObservable());

    this.preSelectedCommissions.subscribe((commissions: Commission[]) => {
          /// we update commissions from data arrived from server
      var comString: { [code: string]: boolean } = {};

      for (let com of commissions){
        comString[com.name] = true;  
      }
    
      this.done = commissions;

      for (let i = this.todo.length-1; i >= 0; i--) {
        if (this.todo[i].name in comString) {
          this.todo.splice(i, 1);
        }
      }
      
    });
    this.selectedCommissions.next(this.done);
  }
  ngOnDestroy(){
    this.onDestroy.emit();
  }

}
