import { TestBed } from '@angular/core/testing';

import { AlgorithmService } from './algorithm.service';
import { parseSubjects } from './algorithm-parser';

import { SUBJECTS_DATA } from './test/request';
import { Combination } from './algorithm-object';

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
});
