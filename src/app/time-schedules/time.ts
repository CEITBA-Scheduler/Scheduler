import {Pipe, PipeTransform} from '@angular/core';
// import {Timeblock} from '../algorithm-interface';
import {Timeblock} from '../materia';



@Pipe({name: 'TimeblockPrintInterval'})
export class TimeblockPrintInterval implements PipeTransform {
  transform(tb: Timeblock): string {
    const startHour = Math.floor(tb.start) + ''; // + '' castea a string.
    const endHour = Math.floor(tb.end) + '';
    let startMin = (60.0 * Math.floor(tb.start - Math.floor(tb.start))) + '';
    let endMin = (60.0 * Math.floor(tb.end - Math.floor(tb.end))) + '';
    if (tb.start - Math.floor(tb.start) < 10.0 / 60.0 ) {
      startMin = '0' + startMin;
    }
    if (tb.end - Math.floor(tb.end) < 10.0 / 60.0 ) {
      endMin = '0' + endMin;
    }
    return startHour + ':' + startMin + '-' + endHour + ':' + endMin;
  }
}
