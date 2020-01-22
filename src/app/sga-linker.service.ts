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

@Injectable({
  providedIn: 'root'
})
export class SgaLinkerService {
  static url = 'https://itbagw.itba.edu.ar';
  static endpoint = `api/v1/courseCommissions/${token.CEITBA}`;

  public allSubjects: BehaviorSubject<{ [id: string]: Subject; }>;
  public allSubjectsValue: { [id: string]: Subject; };
  public allCommissions = null;
  public rawHttpResponse = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.allSubjects = new BehaviorSubject<{ [id: string]: Subject; }>({});
    this.getDataFromApi();
  }

  /**
   *  Generates the url for the HTTP Request using the GET method by formatting
   *  the string content with the url, endpoint and its parameters.
   *  @param  url         The REST API url
   *  @param  endpoint    The resource endpoint
   *  @param  params      The request parameters
   */
  public static httpRequestUrlFormat(url: string, endpoint: string, params): string {
    let resource = `${SgaLinkerService.url}/${SgaLinkerService.endpoint}?`;
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
  public static removeTildes(word: string): string {
    return word.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u');
  }

  /**
   * Translates the weekday from english to lowercase spanish
   * @param name  The current day
   */
  public static translateDayName(name: string): string {
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

<<<<<<< HEAD
  getAllSubjects() : Observable<{ [id: string]: Subject; }> {
    return this.AllSubjects.asObservable();
=======
  /**
   * Returns the raw response of the HTTP request made
   */
  getRawResponse(): any {
    return this.rawHttpResponse;
>>>>>>> 3b24848c4159fcbf2a11f19479c4c25ed6a8277f
  }

  /**
   * Creates and sends the HTTP request to the SGA server, and saves the
   * raw JSON response inside the service instance. Returns an observable.
   */
  getAllComissions(): Observable<any> {
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
      SgaLinkerService.url,
      SgaLinkerService.endpoint,
      params
    );
    return this.http
      .get(url)
      .pipe(shareReplay(1));
  }

  /**
   * Updates the internal subject data by making the HTTP request
   * and parsing it into the internal properties of the Service
   */
  getDataFromApi(): void {
    this.getAllComissions().subscribe(data => {
      // Here I set what happens when I receive something from get (asynchronous)
      this.rawHttpResponse = data;
      this.allCommissions = data.courseCommissions.courseCommission;
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
          professors: [],
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
        priority: 0
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

