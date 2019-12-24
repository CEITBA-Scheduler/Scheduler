import { TestBed } from '@angular/core/testing';

import { CombinacionDeHorarioService } from './combinacion-de-horario.service';

describe('CombinacionDeHorarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CombinacionDeHorarioService = TestBed.get(CombinacionDeHorarioService);
    expect(service).toBeTruthy();
  });
});
