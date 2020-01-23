import { Injectable } from '@angular/core';
import { Timeblock } from './algorithm/algorithm-object';

@Injectable({
  providedIn: 'root'
})
export class CalendarServiceService {
  private timeblocks: Timeblock[];

  constructor() { }

  public setTimeblocks(timeblocks: Timeblock[]) {
    this.timeblocks = timeblocks;
  }

  public getTimeblocks(): Timeblock[] {
    return this.timeblocks;
  }

}
