import { Injectable } from '@angular/core';
import { Subject, Commission, Timeblock } from './materia';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, startWith, shareReplay } from 'rxjs/operators';
import { parse } from 'date-fns';
import { UserSelection } from './materia';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { token } from './secrets';
import { PROFESSORS } from '../assets/professors';

import {
  CareerPlan,
  CareerCycle,
  CareerTerm,
  CareerSubject
} from './career-object';

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  static URL = 'https://itbagw.itba.edu.ar';
  static SUBJECTS_ENDPOINT = `api/v1/courseCommissions/${token.CEITBA}`;
  static CAREER_ENDPOINT = `api/v1/careerPlans/${token.CEITBA}`;

  public allSubjects: BehaviorSubject<{ [id: string]: Subject; }>;
  public allSubjectsValue: { [id: string]: Subject; };
  public allCommissions = null;

  public careerPlan: BehaviorSubject<CareerPlan>;

  public rawSubjectsResponse = null;
  public rawCareerResponse = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.allSubjects = new BehaviorSubject<{ [id: string]: Subject; }>({});
    this.careerPlan = new BehaviorSubject<CareerPlan>(new CareerPlan());
    this.getSubjectsDataFromApi();
    this.getCareerDataFromApi();
  }

  /**
   *  Generates the url for the HTTP Request using the GET method by formatting
   *  the string content with the url, endpoint and its parameters.
   *  @param  url         The REST API url
   *  @param  endpoint    The resource endpoint
   *  @param  params      The request parameters
   */
  private static httpRequestUrlFormat(url: string, endpoint: string, params): string {
    let resource = `${url}/${endpoint}?`;
    for (const resourceKey of Object.keys(params)) {
      resource += `${resourceKey}=${params[resourceKey]}&`;
    }
    if (resource.charAt(resource.length - 1) === '&') {
      resource = resource.slice(0, resource.length - 1);
    }
    return resource;
  }

  /**
   *  Replaces the word's letters with tildes to avoid
   *  problems with the string codification used.
   *  @param  word  The raw string to be formatted
   */
  private static removeTildes(word: string): string {
    return word.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u');
  }

  /**
   * Translates the weekday from english to lowercase spanish
   * @param name  The current day
   */
  private static translateDayName(name: string): string {
    if (name === 'MONDAY') {
      return 'Lunes';
    } else if (name === 'TUESDAY') {
      return 'Martes';
    } else if (name === 'WEDNESDAY') {
      return 'Miércoles';
    } else if (name === 'THURSDAY') {
      return 'Jueves';
    } else if (name === 'FRIDAY') {
      return 'Viernes';
    }

    return null;
  }

  /**
   * Merges the SGA response data with the professors data
   * @param commissionData  The data returned from the SGA endpoint
   * @param professorData   The data returned from the professors endpoint/hardcoded
   */
  private static mergeProfessorsToData(commissionData, professorsData) {
    const commissions = commissionData.courseCommissions.courseCommission;
    const professors = professorsData.commissions;
    for (const professor of professors) {
      const commission = commissions.find(
        element => element.subjectCode === professor.subjectCode && element.commissionName === professor.commission);
      if (commission) {
        if (!commission.hasOwnProperty('professors')) {
          commission.professors = [professor.professorName];
        } else {
          if (!commission.professors.find(element => element === professor.professorName)) {
            commission.professors.push(professor.professorName);
          }
        }
      }
    }
    return commissionData;
  }

  /**
   * Returns the raw response of the HTTP request made
   */
  getRawSubjects(): any {
    return this.rawSubjectsResponse;
  }

  /**
   * Returns the raw response of the HTTP request made
   */
  getRawCareer(): any {
    return this.rawCareerResponse;
  }

  /**
   * Creates and sends the HTTP request to the SGA server, and saves the
   * raw JSON response inside the service instance. Returns an observable.
   */
  requestAllComissions(): Observable<any> {
    // Parameters for the HTTP Request are created
    // with the current corresponding data...
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const params = {
      level: 'GRADUATE',
      year: currentYear,
      period: currentMonth === 0 || currentMonth === 1 || currentMonth > 6 ? 'FirstSemester' : 'SecondSemester'
    };

    // Generating the url for the HTTP Request and
    // saving the raw json response for future uses and cache
    const url = SgaLinkerService.httpRequestUrlFormat(
      SgaLinkerService.URL,
      SgaLinkerService.SUBJECTS_ENDPOINT,
      params
    );

    return this.http
      .get(url)
      .pipe(shareReplay(1));
  }

  /**
   * Creates and sends the HTTP request to the SGA server, and saves the
   * raw JSON response inside the service instance. Returns an observable.
   * @param plan  The career plan
   */
  requestCareerPlan(careerPlan: string): Observable<any> {
    // Creating the request parameters
    const params = {
      plan: careerPlan
    };

    // Generating the GET url
    const url = SgaLinkerService.httpRequestUrlFormat(
      SgaLinkerService.URL,
      SgaLinkerService.CAREER_ENDPOINT,
      params
    );

    return this.http
      .get(url)
      .pipe(shareReplay(1));
  }

  /**
   * Updates the internal career data by making the HTTP request
   * and parsing it into the internal properties of the Service
   */
  getCareerDataFromApi(): void {
    this.authService.getUserObservable()
    .subscribe(
      user => {
        // When the user has logged in succesfully, then
        // we have enough data to get its career plan
        if (user) {
          this.requestCareerPlan(user.plan)
          .subscribe(
            data => {
              // Saving the raw response from SGA server
              this.rawCareerResponse = data.careerplan;

              // First, we need to create the instance of the
              // career plan and through a loop create every cycle
              const careerPlan = new CareerPlan(
                this.rawCareerResponse.name,
                this.rawCareerResponse.career,
                this.rawCareerResponse.degreeLevel
              );

              // We create each possible cycle in the career plan
              for (const cycle of this.rawCareerResponse.section) {
                const newCareerCycle = new CareerCycle(cycle.name);
                if (cycle.terms) {
                  for (const term of cycle.terms.term) {
                    const newCareerTerm = new CareerTerm(
                      term.year,
                      term.period
                    );
                    for (const subject of term.entries.entry) {
                      const newCareerSubject = new CareerSubject(
                        subject.name,
                        subject.code,
                        subject.credits,
                        Array.isArray(subject.dependencies) ? subject.dependencies : [subject.dependencies]
                      );
                      newCareerTerm.addSubject(newCareerSubject);
                    }
                    newCareerCycle.addTerm(newCareerTerm);
                  }
                  careerPlan.addCycle(newCareerCycle);
                } else if (cycle.withoutTerm) {
                  const newCareerTerm = new CareerTerm(
                    '-',
                    '-'
                  );
                  for (const subject of cycle.withoutTerm.withoutTerm) {
                    const newCareerSubject = new CareerSubject(
                      subject.name,
                      subject.code,
                      subject.credits,
                      Array.isArray(subject.dependencies) ? subject.dependencies : [subject.dependencies]
                    );
                    newCareerTerm.addSubject(newCareerSubject);
                  }
                  newCareerCycle.addTerm(newCareerTerm);
                }
                careerPlan.addCycle(newCareerCycle);
              }

              this.careerPlan.next(careerPlan);
            }
          );
        }
      }
    );
  }

  /**
   * Updates the internal subject data by making the HTTP request
   * and parsing it into the internal properties of the Service
   */
  getSubjectsDataFromApi(): void {
    this.requestAllComissions().subscribe(data => {
      // Here I set what happens when I receive something from get (asynchronous)
      this.rawSubjectsResponse = SgaLinkerService.mergeProfessorsToData(data, PROFESSORS);
      this.allCommissions = this.rawSubjectsResponse.courseCommissions.courseCommission;
      this.allSubjectsValue = {};

      // For all commissions in the SGA response
      for (const commission of this.allCommissions) {
        // Verifying that there are some commissions, if not then this subject
        // must be skipped...
        if (commission.courseCommissionTimes === undefined) {
          continue;
        }

        // Create some constant values to be used when querying the object
        // and checks if the subject's commission has only one or an array of
        // timeblocks...
        const name = commission.subjectName;
        const timeBlockArr = [];

        let commissionTimes = [];
        if (Array.isArray(commission.courseCommissionTimes)) {
          commissionTimes = commission.courseCommissionTimes;
        } else {
          commissionTimes.push(commission.courseCommissionTimes);
        }

        // Push each TimeBlock in the commission
        for (const schedule in commissionTimes) {
          if (commissionTimes.hasOwnProperty(schedule)) {
            const startDate: Date = parse(commissionTimes[schedule].hourFrom, 'HH:mm', new Date());
            const endDate: Date = parse(commissionTimes[schedule].hourTo, 'HH:mm', new Date());

            const currTimeBlock: Timeblock = {
              day: SgaLinkerService.translateDayName(commissionTimes[schedule].day),
              start: {hours: startDate.getHours(), minutes: startDate.getMinutes()},
              end: {hours: endDate.getHours(), minutes: endDate.getMinutes()}
            };

            timeBlockArr.push(currTimeBlock);
          }
        }

        // Create the current comission with its current schedule
        const currCommission: Commission = {
          name: commission.commissionName,
          professors: commission.professors,
          subject: null,
          schedule: timeBlockArr
        };

        // Here is where we add the subject's commission to a pool where
        // we check if the subject already exists and the commission must be appended
        // or if the subject should be created for the first time...
        this.addToAllSubjects(name, commission, currCommission);
      }

      this.allSubjects.next(this.allSubjectsValue);
    });
  }

  /**
   * Returns the career plan as an observable
   */
  getCareerPlan(): Observable<CareerPlan> {
    return this.careerPlan.asObservable();
  }

  /**
   * A new commission has been received from the http service and it is being added
   * to the subject property. It verifies whether the commission's subject is already
   * in the property or not.
   * @param name  The commission's name
   * @param commission  The commission object
   * @param currCommission  The parsed commission object
   */
  addToAllSubjects(name: string, commission: any, currCommission: Commission): void {
    if (!this.allSubjectsValue[commission.subjectCode]) {
      // If such subject doesn't exist, we create it and then add it to the dictionary
      const currSubject: Subject = {
        name: commission.subjectName,
        code: commission.subjectCode,
        search: SgaLinkerService.removeTildes((commission.subjectName + commission.subjectCode).toLowerCase()),
        commissions: [currCommission],
        priority: 0,
        credits: null,
      };
      this.allSubjectsValue[commission.subjectCode] = currSubject;
    } else {
      // If the subject exists, we just push the comission
      this.allSubjectsValue[commission.subjectCode].commissions.push(currCommission);
    }
  }

  /**
   * Returns all the subjects as an observable
   */
  getAllSubjects(): Observable<{ [id: string]: Subject; }> {
    return this.allSubjects.asObservable();
  }

  /**
   * Returns all the subjects as an observable, but using a list not a map/dictionary
   */
  getAllSubjectsAsList(): Observable<Subject[]> {
    // Esta funcion consigue en una lista todos los valores de un diccionario
    const getValues = (dic: {[id: string]: Subject}): Subject[] => {
      const ans: Subject[] = [];
      for (const key in dic) {
        if (dic.hasOwnProperty(key)) {
          ans.push(dic[key]);
        }
      }
      return ans;
    };

    // Convertimos el observable que usa diccionarios en un observable que usa listas
    return this.getAllSubjects().pipe(
      map( (data: { [id: string]: Subject; } )  => getValues(data) )
    );
  }

  /**
   * Returns all the commissions as a list from the corresponding subject
   * @param subject The given subject
   */
  getCommissions(subject: Subject): Commission[] {
    return this.allSubjectsValue[subject.code].commissions;
  }
}

