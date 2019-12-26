import {Time} from '@angular/common';

export class Subject{
    name: string;
    code: string;
    search: string;
    comissions : Comission[];
    priority: number;
}
export class Timeblock{
    dia : String;
    start : Time;
    end : Time;
}

export class Comission{
    name : string;
    profesores : string[];
    subject : Subject;
    schedule : Timeblock[];
}

