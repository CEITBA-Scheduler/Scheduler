import {Time} from '@angular/common';

export interface Subject {
    name: string;
    code: string;
    search: string;
    commissions?: Commission[];
    priority?: number;
}
export interface Timeblock {
    day: string;
    start: Time;
    end: Time;
}
export interface Commission {
    name: string;
    professors: string[];
    subject?: Subject;
    schedule: Timeblock[];
}

export interface UserSelection{

}

