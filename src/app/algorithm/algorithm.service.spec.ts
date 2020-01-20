import { TestBed } from '@angular/core/testing';

import { Priority, SubjectSelection, Timeblock } from './algorithm-object';
import { Weekday } from './algorithm-interface';
import { AlgorithmService } from './algorithm.service';
import { parseSubjects } from './algorithm-parser';

import { SUBJECTS_DATA } from './test/request';

fdescribe('AlgorithmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  fit('should be created', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    expect(service).toBeTruthy();
  });

  fit('should order with quicksort', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    const testArray = [1, 3, 99, 8, 67, 45, 21, 26, 66, 35, 28, 19, 17];
    console.log(
      service.quicksort(
        testArray,
        0,
        testArray.length - 1
      )
    );
  });

  fit('should generate combinations', () => {
    const FISICA_3 = '93.43';
    const ELECTROTECNIA_1 = '22.02';
    const MATEMATICA_5 = '93.38';
    const LABORATORIO_DE_ELECTRONICA = '22.42';
    const MATEMATICA_DISCRETA = '93.16';
    const MATEMATICA_3 = '93.03';
    const PROGRAMACION_1 = '22.07';
    const PROGRAMACION = '71.85';
    const FISICA_1 = '93.41';
    const FISICA_2 = '93.42';

    const service: AlgorithmService = TestBed.get(AlgorithmService);

    const subjects = parseSubjects(SUBJECTS_DATA);
    console.log(`All Subjects have been parsed. Result of ${subjects.length} subjects.`);
    console.log(subjects);

    const selectedSubjects: SubjectSelection[] = SubjectSelection.generateSelectionByArray(
      [
        FISICA_3,
        ELECTROTECNIA_1,
        MATEMATICA_5
      ]
    );
    console.log('User SubjectSelections');
    console.log(selectedSubjects);

    const priorities: Priority[] = Priority.generateWeightedPriorities(
      [
        Priority.gpCommission('A', FISICA_3),
        Priority.gpFreeDay(Weekday.THURSDAY),
        Priority.gpBusyTime([new Timeblock(Weekday.FRIDAY, 8, 12)]),
        Priority.gpLocation(),
        Priority.gpSuperposition(3),
      ]
    );
    console.log('User Priorities');
    console.log(priorities);

    console.log('Possible combinations incoming...');
    console.log(service.schedulerAlgorithm(subjects, selectedSubjects, priorities, 'sort'));
  });
});
