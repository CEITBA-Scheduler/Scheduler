import {Time} from '@angular/common';

export interface Subject {
    name: string;
    code: string;
    search: string;
    comissions: Comission[];
    priority: number;
}
export interface Timeblock {
    day: string;
    start: Time;
    end: Time;
}

export interface Comission {
    name: string;
    profesores: string[];
    subject?: Subject;
    schedule: Timeblock[];
}
