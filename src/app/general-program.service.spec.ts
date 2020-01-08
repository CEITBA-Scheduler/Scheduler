import { TestBed } from '@angular/core/testing';

import { GeneralProgramService } from './general-program.service';

describe('GeneralProgramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralProgramService = TestBed.get(GeneralProgramService);
    expect(service).toBeTruthy();
  });
});
