import { TestBed } from '@angular/core/testing';

import { Combination, SubjectSelection } from './algorithm-object';
import { AlgorithmService } from './algorithm.service';
import { parseSubjects } from './algorithm-parser';

import { SUBJECTS_DATA } from './test/request';

fdescribe('AlgorithmService', () => {
  const subjects = parseSubjects(SUBJECTS_DATA);
  beforeEach(() => TestBed.configureTestingModule({}));

  console.log('All Subjects have been parsed: ');
  console.log(subjects);

  fit('should be created', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    expect(service).toBeTruthy();
  });

  fit('should generate possible combinations', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    expect(
      service.searchCombinations(
          subjects.slice(0, 3),
          () => true
      )
    ).toBeTruthy();
  });

  fit('console log combinations', () => {
    const service: AlgorithmService = TestBed.get(AlgorithmService);
    const results = service.searchCombinations(
        subjects.slice(0, 3),
        () => true
    );

    console.log(results);
  });

  // Testing code for schedulerAlgorithm, outputs will go to the
  // console to live check through the web browser
  const selectedSubjects: SubjectSelection[] = SubjectSelection.generateSelectionByArray(
    ['93.43', '23.09', '93.38', '94.24']
  );
});
