import { TestBed } from '@angular/core/testing';

import { MateriasService } from './materias.service';

describe('MateriasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MateriasService = TestBed.get(MateriasService);
    expect(service).toBeTruthy();
  });
});
