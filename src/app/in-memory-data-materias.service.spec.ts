import { TestBed } from '@angular/core/testing';

import { InMemoryDataMateriasService } from './in-memory-data-materias.service';

describe('InMemoryDataMateriasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InMemoryDataMateriasService = TestBed.get(InMemoryDataMateriasService);
    expect(service).toBeTruthy();
  });
});
