import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { DbServicesService } from '../db-services.service';
import { AlgorithmService } from '../algorithm/algorithm.service';
import { SgaLinkerService } from '../sga-linker.service';
import { CombinacionDeHorarioService } from '../combinacion-de-horario.service';
import { GeneralProgramService } from '../general-program.service';
import { CalendarServiceService } from '../calendar-service.service';

import {
  SubjectSelection,
  Subject,
  Priority,
  Combination
} from '../algorithm/algorithm-object';
import { parseSubjects } from '../algorithm/algorithm-parser';
import { Weekday } from '../algorithm/algorithm-interface';

/**
 * CombinerComponent
 * NOTE: The combiner component helds the user's preferences
 * for running the algorithm using the class-definitions from
 * the algorithm branch. Subjects, Selections, Priorities and
 * the resulting Combination are included in this.
 */

@Component({
  selector: 'app-combiner',
  templateUrl: './combiner.component.html',
  styleUrls: ['./combiner.component.css']
})
export class CombinerComponent implements OnInit {
  public subjects: Subject[];
  public subjectSelections: SubjectSelection[];
  public priorities: Priority[];
  public combinations: Combination[];

  constructor(
    private router: Router,
    private authService: AuthService,
    private dbServices: DbServicesService,
    private algorithmServices: AlgorithmService,
    private sgaLinkerServices: SgaLinkerService,
    private generalProgramService: GeneralProgramService,
    private scheduleCombinerServices: CombinacionDeHorarioService,
    private calendarService: CalendarServiceService) { }

  ngOnInit() {
    this.authService.getUserObservable().subscribe((user: User) => {
      if (!this.authService.getLoading()) {
        if (user != null) {
          this.router.navigate(['/combinadorDeHorarios']);
          this.dbServices.askForUserSubjectSelection();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Callback for login out the current user session.
   */


  /**
   * Callback for running the combiner algorithm when
   * the user has finished configuring all its preferences.
   */
  runCombiner() {
    // Using database services to store user's preferences
    // for future analysis and stadistics
    this.dbServices.storeUserPreAlgorithmSelection();

    // Cleaning up the internal instances
    this.subjects = [];
    this.priorities = [];
    this.combinations = [];
    this.subjectSelections = [];

    // When building the singleton instance of SgaLinkerService,
    // the raw response of the http request made to the sga endpoint
    // is saved, so we use and parse that data
    this.subjects = parseSubjects(this.sgaLinkerServices.getRawSubjects());

    // Then, we need to build a list of SubjectSelection to be used as the
    // user's choice of subjects for the algorithm
    this.scheduleCombinerServices.getMaterias()
    .subscribe( (subjects) => {

      this.subjectSelections = SubjectSelection.generateSelectionByArray(
        subjects.map(subject => subject.code)
      );
    });

    // Finally, we update the user's priorities by gathering data that has been
    // set in different components or services. First, we create each priority
    // in a list ussing the priority factories, finally we set their weights.

    // Here, we take the commission priorities from the combination service
    this.scheduleCombinerServices.getCommissionsSelectedData()
    .subscribe( (data) => {

      for (const subjectCode in data) {
        if (data.hasOwnProperty(subjectCode)) {
          const subject = data[subjectCode];
          if (subject.hasOwnProperty('commissions')) {
            const commissionPriorities: Priority[] = [];
            for (const subjectCommission of subject.commissions) {
              commissionPriorities.push(
                Priority.gpCommission(subjectCommission.name, subjectCode)
                        .setExclusive(true)
              );
            }
            if (commissionPriorities.length > 0) {
              this.priorities.push(
                Priority.gpMultiple(commissionPriorities).setExclusive(true)
              );
            }
          }
        }
      }
    });

    // Here, we take the other priorities from the general purpose service
    // and because the user interface has been simplified we use some
    // default values for the priority's settings
    const DEFAULT_SUPERPOSITION = 4.0;    // max amount of overlapped hours
    const DEFAULT_FREEDAY = Weekday.ANY;  // which freeday
    const DEFAULT_TRAVEL = 1.0;
    const userPreferences = this.generalProgramService.getAllCheckboxStatus();
    if (userPreferences.superposition) {
      this.priorities.push(
        Priority.gpSuperposition(DEFAULT_SUPERPOSITION).setExclusive(false)
      );
    } else {
      this.priorities.push(
        Priority.gpSuperposition(0.0).setExclusive(true)
      );
    }
    if (userPreferences.freeday) {
      this.priorities.push(
        Priority.gpFreeDay(DEFAULT_FREEDAY).setExclusive(true)
      );
    }
    if (userPreferences.buildingChange) {
      this.priorities.push(
        Priority.gpLocation().setExclusive(true)
      );
    }
    if (userPreferences.travelTime) {
      this.priorities.push(
        Priority.gpTravel(DEFAULT_TRAVEL).setExclusive(true)
      );
    }

    const timeblocks = this.calendarService.getTimeblocks();
    if (timeblocks) {
      if (timeblocks.length > 0) {
        this.priorities.push(
          Priority.gpBusyTime(timeblocks).setExclusive(true)
        );
      }
    }

    // Then, we set the priority weights
    this.priorities = Priority.generateWeightedPriorities(this.priorities);

    console.log('=== Subjects ===');
    console.log(this.subjects);
    console.log('=== Subjects Selected ===');
    console.log(this.subjectSelections);
    console.log('=== Priorities ===');
    console.log(this.priorities);

    this.combinations = this.algorithmServices.schedulerAlgorithm(
      this.subjects,            // All the possible subjects
      this.subjectSelections,   // User's selected subjects
      this.priorities,          // User's priorities
      'quicksort'               // Available sorting algorithm
    );

    this.scheduleCombinerServices.setAlgorithmResults(
      this.combinations
    );

    // Using the algorithm... Let's run it!

    console.log('=== Subjects ===');
    console.log(this.subjects);
    console.log('=== Subjects Selected ===');
    console.log(this.subjectSelections);
    console.log('=== Priorities ===');
    console.log(this.priorities);
    console.log('=== Combinations ===');
    console.log(this.combinations);

    this.router.navigate(['/results']);
  }
}
