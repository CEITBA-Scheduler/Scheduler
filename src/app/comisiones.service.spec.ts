import { TestBed } from '@angular/core/testing';

import { ComisionesService } from './comisiones.service';

describe('ComisionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComisionesService = TestBed.get(ComisionesService);
    expect(service).toBeTruthy();
  });
});
