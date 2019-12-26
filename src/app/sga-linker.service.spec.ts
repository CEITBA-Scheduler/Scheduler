import { TestBed } from '@angular/core/testing';

import { SgaLinkerService } from './sga-linker.service';

describe('SgaLinkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SgaLinkerService = TestBed.get(SgaLinkerService);
    expect(service).toBeTruthy();
  });
});
